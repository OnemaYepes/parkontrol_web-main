const path = require('node:path');
const dotenv = require('dotenv');
const { defineConfig } = require('cypress');

dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 20000,
    responseTimeout: 20000,
    setupNodeEvents(on, config) {
      // expose OPENAI_API_KEY to the browser tests via config.env
      config.env = config.env || {};
      config.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY;

      // register a task to call the OpenAI Chat Completions API
      on('task', {
        async openai({ prompt, model = 'gpt-3.5-turbo' }) {
          const apiKey = process.env.OPENAI_API_KEY;
          if (!apiKey) {
            return { error: 'OPENAI_API_KEY not set in environment' };
          }

          const body = {
            model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 800,
            temperature: 0.2,
          };

          try {
            const fetchFn = global.fetch || require('node-fetch');
            const res = await fetchFn('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify(body),
            });
            const json = await res.json();
            if (json.error) return { error: json.error };
            return { result: json.choices && json.choices[0] && json.choices[0].message ? json.choices[0].message.content : '' };
          } catch (err) {
            return { error: String(err) };
          }
        },
      });

      return config;
    },
  },
});
