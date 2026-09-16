import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { handleChatRequest } from './server/rag/chatHandler'

function ragBackendPlugin(): Plugin {
  return {
    name: 'rag-backend-plugin',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/chat' || req.url?.startsWith('/api/chat?')) {
          await handleChatRequest(req, res, {
            GROQ_API_KEY: env.GROQ_API_KEY || process.env.GROQ_API_KEY,
            GEMINI_API_KEY: env.GEMINI_API_KEY || process.env.GEMINI_API_KEY,
          });
        } else {
          next();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ragBackendPlugin()],
})
