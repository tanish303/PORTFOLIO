import fs from 'fs';
import path from 'path';
import { knowledgeChunks, type KnowledgeChunk } from './knowledgeBase.ts';

interface CachedEmbedding {
  id: string;
  vector: number[];
}

interface EmbeddingsCacheFile {
  version: string;
  chunks: CachedEmbedding[];
}

export interface RetrievedChunk {
  chunk: KnowledgeChunk;
  score: number;
}

const CACHE_FILE_PATH = path.resolve(process.cwd(), 'server/rag/embeddings-cache.json');

const CURRENT_CACHE_VERSION = '3.0';

let inMemoryVectors: Map<string, number[]> = new Map();
let isInitialized = false;

function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

function magnitude(v: number[]): number {
  let sum = 0;
  for (let i = 0; i < v.length; i++) {
    sum += v[i] * v[i];
  }
  return Math.sqrt(sum);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0;
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}

export async function fetchGeminiEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  if (!apiKey) return null;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text }] },
      }),
    });

    if (!response.ok) {
      console.warn(`[RAG] Gemini embedding failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = (await response.json()) as any;
    if (data?.embedding?.values && Array.isArray(data.embedding.values)) {
      return data.embedding.values as number[];
    }
    return null;
  } catch (err) {
    console.warn('[RAG] Error fetching Gemini embedding:', err);
    return null;
  }
}

export async function initializeRAG(geminiApiKey?: string): Promise<void> {
  if (isInitialized && inMemoryVectors.size > 0) return;

  // 1. Try reading cache from disk
  if (fs.existsSync(CACHE_FILE_PATH)) {
    try {
      const raw = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      const parsed: EmbeddingsCacheFile = JSON.parse(raw);
      if (parsed.version === CURRENT_CACHE_VERSION && parsed.chunks && Array.isArray(parsed.chunks)) {
        for (const item of parsed.chunks) {
          if (item.id && Array.isArray(item.vector)) {
            inMemoryVectors.set(item.id, item.vector);
          }
        }
        console.log(`[RAG] Loaded ${inMemoryVectors.size} cached vector embeddings from disk (v${CURRENT_CACHE_VERSION}).`);
      } else {
        console.log('[RAG] Cache version mismatch or outdated cache. Refreshing embeddings...');
        inMemoryVectors.clear();
      }
    } catch (e) {
      console.warn('[RAG] Could not read embeddings cache file, will regenerate:', e);
    }
  }

  // 2. Check if all knowledgeChunks have embeddings; generate missing ones
  let dirty = false;
  if (geminiApiKey) {
    for (const chunk of knowledgeChunks) {
      if (!inMemoryVectors.has(chunk.id)) {
        console.log(`[RAG] Generating embedding for chunk: ${chunk.id}...`);
        const textToEmbed = `${chunk.title}\n${chunk.keywords.join(', ')}\n${chunk.content}`;
        const vector = await fetchGeminiEmbedding(textToEmbed, geminiApiKey);
        if (vector) {
          inMemoryVectors.set(chunk.id, vector);
          dirty = true;
        }
      }
    }

    // Save to disk cache if new embeddings were calculated
    if (dirty) {
      try {
        const dir = path.dirname(CACHE_FILE_PATH);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const cacheData: EmbeddingsCacheFile = {
          version: CURRENT_CACHE_VERSION,
          chunks: Array.from(inMemoryVectors.entries()).map(([id, vector]) => ({ id, vector })),
        };
        fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cacheData), 'utf-8');
        console.log(`[RAG] Saved ${inMemoryVectors.size} vector embeddings to cache (v${CURRENT_CACHE_VERSION}).`);
      } catch (err) {
        console.error('[RAG] Failed to write embeddings cache:', err);
      }
    }
  }

  isInitialized = true;
}

/**
 * Keyword & Entity Overlap fallback scoring
 */
function computeKeywordScore(query: string, chunk: KnowledgeChunk): number {
  const q = query.toLowerCase();
  const words = q.split(/[^a-z0-9+#.-]+/).filter((w) => w.length > 2);
  let score = 0;

  for (const word of words) {
    // Check keywords list
    for (const kw of chunk.keywords) {
      if (kw === word) score += 2.0;
      else if (kw.includes(word)) score += 1.0;
    }
    // Check title
    if (chunk.title.toLowerCase().includes(word)) {
      score += 1.5;
    }
    // Check content
    if (chunk.content.toLowerCase().includes(word)) {
      score += 0.5;
    }
  }

  // Exact entity boosts
  if (q.includes('tweniq') && chunk.id === 'project-tweniq') score += 5;
  if (q.includes('copywizz') && chunk.id === 'project-copywizz') score += 5;
  if (q.includes('cloudtechner') && chunk.id === 'experience-cloudtechner') score += 12;
  if (q.includes('adayptus') && chunk.id === 'experience-adayptus') score += 6;
  if (q.includes('coding blocks') && chunk.id === 'experience-codingblocks') score += 6;
  if ((q.includes('who is') || q.includes('about')) && chunk.id === 'about-identity') score += 4;
  if (q.includes('skill') && chunk.id === 'skills-technical') score += 4;
  if ((q.includes('college') || q.includes('degree') || q.includes('education')) && chunk.id === 'education-academics') score += 4;
  if ((q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('linkedin')) && chunk.id === 'contact-socials') score += 4;
  if (q.includes('why hire') && chunk.id === 'why-hire-tanish') score += 4;
  if ((q.includes('portfolio') || q.includes('website') || q.includes('planet') || q.includes('solar') || q.includes('universe') || q.includes('sun') || q.includes('mercury') || q.includes('venus') || q.includes('earth') || q.includes('mars') || q.includes('jupiter') || q.includes('saturn') || q.includes('uranus') || q.includes('neptune') || q.includes('rocket') || q.includes('supernova') || q.includes('orbit')) && chunk.id === 'portfolio-universe-planets') score += 8;

  // General experience/internship query boost: CloudTechner is MAIN and MUST be ranked highest
  if (q.includes('experience') || q.includes('internship') || q.includes('work') || q.includes('job') || q.includes('company') || q.includes('companies')) {
    if (chunk.id === 'experience-cloudtechner') score += 10;
    else if (chunk.id === 'experience-adayptus') score += 4;
    else if (chunk.id === 'experience-codingblocks') score += 2;
  }

  return score;
}

/**
 * Semantic Retrieval Engine:
 * Generates query embedding, calculates cosine similarity with chunk vectors,
 * applies keyword boost, and returns the top-k most relevant chunks.
 */
export async function retrieveRelevantChunks(
  query: string,
  geminiApiKey?: string,
  topK: number = 3
): Promise<RetrievedChunk[]> {
  await initializeRAG(geminiApiKey);

  let queryVector: number[] | null = null;
  if (geminiApiKey && inMemoryVectors.size > 0) {
    queryVector = await fetchGeminiEmbedding(query, geminiApiKey);
  }

  const scored: RetrievedChunk[] = knowledgeChunks.map((chunk) => {
    let semanticScore = 0;
    if (queryVector && inMemoryVectors.has(chunk.id)) {
      const chunkVector = inMemoryVectors.get(chunk.id)!;
      semanticScore = cosineSimilarity(queryVector, chunkVector);
    }

    const keywordScore = computeKeywordScore(query, chunk);

    // Hybrid combined score: semantic similarity normalized (0 to 1, scaled * 10) + keyword overlap
    const totalScore = (semanticScore > 0 ? semanticScore * 10 : 0) + keywordScore;

    return {
      chunk,
      score: totalScore,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // If query is asking about experience/internships, guarantee all experience chunks are retrieved with CloudTechner first
  const isExperienceQuery = /experience|internship|work|companies|career/i.test(query);
  if (isExperienceQuery) {
    const expChunks = scored.filter((s) => s.chunk.category === 'experience');
    // Ensure CloudTechner is strictly first among experience chunks
    expChunks.sort((a, b) => {
      if (a.chunk.id === 'experience-cloudtechner') return -1;
      if (b.chunk.id === 'experience-cloudtechner') return 1;
      if (a.chunk.id === 'experience-adayptus') return -1;
      if (b.chunk.id === 'experience-adayptus') return 1;
      return 0;
    });
    const nonExpChunks = scored.filter((s) => s.chunk.category !== 'experience');
    return [...expChunks, ...nonExpChunks].slice(0, Math.max(topK, expChunks.length));
  }

  // Return top K
  return scored.slice(0, topK);
}
