import type { IncomingMessage, ServerResponse } from 'http';
import { handleChatRequest } from '../server/rag/chatHandler';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await handleChatRequest(req, res, {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  });
}
