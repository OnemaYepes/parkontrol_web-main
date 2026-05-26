const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "y53a2w",
  
  e2e: {
    // Global test settings
    baseUrl: "http://localhost:4200",
    specPattern: "cypress/e2e/**/*.cy.js",
    fixturesFolder: 'cypress/fixtures',
    supportFile: "cypress/support/e2e.js",
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    execTimeout: 60000,
    
    // Performance
    pageLoadTimeout: 60000,
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test settings
    video: true,
    videosFolder: "cypress/videos",
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    
    // Reporter configuration
    reporterOptions: {
      mochaFile: "cypress/reports/junit/results-[hash].xml",
      toConsole: true,
    },
    
    setupNodeEvents(on, config) {
      // Configurar plugins y listeners de eventos
      require("./cypress/plugins/index.js")(on, config);
      
      return config;
    },
    
    // Retries
    retries: {
      runMode: 1,
      openMode: 0,
    },
    
    // Env variables
    env: {
      API_BASE_URL: "http://localhost:3000/api",
      API_TIMEOUT: 10000,
      LOGIN_URL: "/login",
      DASHBOARD_URL: "/dashboard",
    },
  },
  
  // Component testing (opcional)
  component: {
    specPattern: "cypress/component/**/*.cy.ts",
    supportFile: "cypress/support/component.ts",
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
  },
});
