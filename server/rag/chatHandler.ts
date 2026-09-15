import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import { retrieveRelevantChunks } from './ragEngine.ts';

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequestBody {
  message: string;
  history?: HistoryMessage[];
}

function getEnvKeys(passedEnv?: { GROQ_API_KEY?: string; GEMINI_API_KEY?: string }) {
  let groq = passedEnv?.GROQ_API_KEY || process.env.GROQ_API_KEY;
  let gemini = passedEnv?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!groq || !gemini) {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
          if (k === 'GROQ_API_KEY' && !groq) groq = v;
          if (k === 'GEMINI_API_KEY' && !gemini) gemini = v;
        }
      }
    }
  }

  return { groq, gemini };
}

export async function handleChatRequest(
  req: IncomingMessage,
  res: ServerResponse,
  env?: { GROQ_API_KEY?: string; GEMINI_API_KEY?: string }
): Promise<void> {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // Parse JSON body
  let rawBody = '';
  req.on('data', (chunk) => {
    rawBody += chunk;
    if (rawBody.length > 50000) {
      req.destroy();
    }
  });

  req.on('end', async () => {
    let body: ChatRequestBody;
    try {
      body = JSON.parse(rawBody);
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      return;
    }

    const userMessage = (body.message || '').trim();
    if (!userMessage) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Message cannot be empty' }));
      return;
    }

    const sanitizedQuery = userMessage.slice(0, 1000);
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
    const { groq: groqKey, gemini: geminiKey } = getEnvKeys(env);

    // Setup SSE response
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const sendSSE = (data: string) => {
      res.write(`data: ${data}\n\n`);
    };

    try {
      // 1. Semantic Retrieval: Retrieve relevant portfolio chunks
      const retrieved = await retrieveRelevantChunks(sanitizedQuery, geminiKey, 3);
      const contextText = retrieved
        .map((r, i) => `[Source ${i + 1}: ${r.chunk.title}]\n${r.chunk.content}`)
        .join('\n\n');

      // 2. System Prompt Formulation
      const systemPrompt = `You are the personal AI assistant built specifically for Tanish Dhingra's portfolio website.
Your role is to represent Tanish accurately, conversationally, and concisely.

CRITICAL OPERATING RULES:
1. Grounding: Rely strictly on the RETRIEVED PORTFOLIO CONTEXT provided below as your sole source of truth.
2. Zero Fabrication: Never invent, extrapolate, or guess projects, companies, dates, skills, metrics, education, or facts not present in the context.
3. Out-of-Scope Questions: If the user asks about topics completely unrelated to Tanish (e.g. general trivia, weather, recipes, unrelated companies), politely state: "I am specifically designed to answer questions about Tanish Dhingra, his projects, skills, education, and experience. I don't have information on that."
4. Identity: Clearly behave as Tanish's AI assistant. Do not claim to be the human Tanish directly (e.g. say "Tanish built...", "His experience includes...", "You can reach him at...").
5. Natural & Concise: Avoid robotic boilerplate or repeating your introduction in every message. Be natural, confident, and direct. Use markdown formatting (bullet points, bolding, inline code) when it improves readability.
6. Highlights: When appropriate, mention his featured projects (TweniQ, CopyWizz), modern tech stack (FastAPI, Docker, React, Node.js, Kubernetes), or achievements (Smart India Hackathon 2023 4th place).
7. WORK EXPERIENCE & INTERNSHIP PRIORITY (MANDATORY):
   - **CloudTechner Services Private Limited is Tanish's MAIN, PRIMARY, and most significant internship.**
   - Whenever asked about Tanish's work experience, internships, or professional background (such as "Tell me about his experience"), **ALWAYS prioritize and lead with CloudTechner first**.
   - Structure experience responses as follows:
     1. Feature **CloudTechner Services Private Limited** first and in full detail as his main/flagship internship (DevOps & Backend Engineer working on Docker, Kubernetes, Terraform, AWS, Jenkins, Python, FastAPI, and automated CI/CD pipelines).
     2. Then concisely summarize his other internships: **ADAYPTUS CONSULTING** (Backend Developer working on MongoDB optimization and backend stability) and **CODINGBLOCKS** (Full Stack Developer working on React, Node.js, and web performance).
   - **NEVER** lead with or focus solely on Coding Blocks. Never explain Coding Blocks first when asked generally about his experience. CloudTechner must always be presented as the main priority and centerpiece of his work experience.

--- RETRIEVED PORTFOLIO CONTEXT ---
${contextText}
-----------------------------------`;

      let streamedSuccessfully = false;

      // Strategy A: Stream via Gemini 3.6 Flash
      if (geminiKey) {
        try {
          const contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

          for (const h of history) {
            contents.push({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content }],
            });
          }

          contents.push({
            role: 'user',
            parts: [{ text: sanitizedQuery }],
          });

          const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?alt=sse&key=${geminiKey}`;
          const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents,
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 900,
              },
            }),
          });

          if (geminiRes.ok && geminiRes.body) {
            const reader = geminiRes.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const events = buffer.split(/\r?\n\r?\n/);
              buffer = events.pop() || '';

              for (const ev of events) {
                const dataStr = ev
                  .split(/\r?\n/)
                  .filter((l) => l.startsWith('data:'))
                  .map((l) => l.replace(/^data:\s*/, ''))
                  .join('');

                if (!dataStr || dataStr === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(dataStr);
                  const textDelta = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (textDelta) {
                    sendSSE(JSON.stringify({ delta: textDelta }));
                    streamedSuccessfully = true;
                  }
                } catch {
                  // Partial JSON chunk
                }
              }
            }
          }
        } catch (geminiErr) {
          console.warn('[RAG] Gemini stream failed, trying Groq fallback:', geminiErr);
        }
      }

      // Strategy B: Fallback to Groq API
      if (!streamedSuccessfully && groqKey) {
        try {
          const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            { role: 'system', content: systemPrompt },
          ];

          for (const h of history) {
            messages.push({ role: h.role, content: h.content });
          }

          messages.push({ role: 'user', content: sanitizedQuery });

          const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: 'groq/compound-mini',
              messages,
              max_tokens: 850,
              stream: true,
            }),
          });

          if (groqRes.ok && groqRes.body) {
            const reader = groqRes.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith('data:')) continue;
                const payload = trimmed.replace(/^data:\s*/, '');
                if (payload === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(payload);
                  const delta = parsed.choices?.[0]?.delta?.content;
                  if (delta) {
                    sendSSE(JSON.stringify({ delta }));
                    streamedSuccessfully = true;
                  }
                } catch {
                  // Partial chunk
                }
              }
            }
          }
        } catch (groqErr) {
          console.warn('[RAG] Groq stream also failed:', groqErr);
        }
      }

      // Strategy C: High-fidelity deterministic answer from retrieved chunks if external services fail
      if (!streamedSuccessfully) {
        let fallbackText = `Here is what I found in Tanish's portfolio:\n\n`;
        for (const r of retrieved) {
          fallbackText += `### ${r.chunk.title}\n${r.chunk.content}\n\n`;
        }
        sendSSE(JSON.stringify({ delta: fallbackText }));
      }

      sendSSE('[DONE]');
      res.end();
    } catch (err: any) {
      console.error('[Chat Handler Error]', err);

      const fallbackMsg =
        "I'm specifically designed to answer questions about Tanish Dhingra, his projects, skills, education, and experience. Feel free to ask about his work or reach out directly at tanishdhingra2003@gmail.com!";

      sendSSE(JSON.stringify({ delta: fallbackMsg }));
      sendSSE('[DONE]');
      res.end();
    }
  });
}
