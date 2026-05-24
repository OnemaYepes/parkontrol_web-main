const path = require('node:path');
const dotenv = require('dotenv');
const { defineConfig } = require('cypress');
const { callOllama } = require('./cypress/support/ollama-client');

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
      on('task', {
        ollama({ prompt }) {
          return callOllama(prompt);
        },
      });

      return config;
    },
  },
});
