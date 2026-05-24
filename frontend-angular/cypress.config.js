const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    defaultCommandTimeout: 10000,
    requestTimeout: 20000,
    responseTimeout: 20000,
  },
});
