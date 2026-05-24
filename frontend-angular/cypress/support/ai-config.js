const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const aiConfig = {
  openAIKey: process.env.OPENAI_API_KEY || null,
  ollamaHost: process.env.OLLAMA_HOST || null,
  geminiModel: process.env.GEMINI_MODEL || null,
  backendUrl: process.env.BACKEND_API_URL || null,
  testAdminEmail: process.env.TEST_ADMIN_EMAIL || null,
  testAdminPassword: process.env.TEST_ADMIN_PASSWORD || null,
};

module.exports = {
  ...aiConfig,
  isAIEnabled: Boolean(aiConfig.openAIKey || aiConfig.ollamaHost),
  getActiveProvider() {
    if (aiConfig.openAIKey) return 'OpenAI';
    if (aiConfig.ollamaHost) return 'Ollama';
    return null;
  },
};
