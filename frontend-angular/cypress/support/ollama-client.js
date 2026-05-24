const aiConfig = require('./ai-config');

const fetchImpl = globalThis.fetch;

function normalizeHost(host) {
  return host ? host.replace(/\/+$/, '') : host;
}

async function callOllama(prompt) {
  const host = normalizeHost(aiConfig.ollamaHost);
  if (!host) {
    throw new Error('OLLAMA_HOST no está configurado. Copia .env.example a .env y define OLLAMA_HOST.');
  }

  const body = {
    model: aiConfig.geminiModel || 'gpt-4o-mini',
    prompt,
    max_tokens: 512,
    temperature: 0.2,
  };

  const response = await fetchImpl(`${host}/v1/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(`Ollama API error ${response.status}: ${JSON.stringify(result)}`);
  }

  return result.completion || result?.choices?.[0]?.message?.content || JSON.stringify(result);
}

module.exports = {
  callOllama,
};
