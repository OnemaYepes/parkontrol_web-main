// Configuración de Cypress para Jenkins/CI
const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  projectId: "parkontrol_e2e_ci",
  
  e2e: {
    // Specs
    baseUrl: process.env.BASE_URL || "http://localhost:4200",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    
    // Timeouts - más largos en CI
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    execTimeout: 60000,
    pageLoadTimeout: 60000,
    
    // Viewport
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Reportes
    video: true,
    videosFolder: "cypress/videos",
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    
    // Reporter
    reporterOptions: {
      mochaFile: "cypress/reports/junit/results-[hash].xml",
      toConsole: true,
      outputs: true,
    },
    
    setupNodeEvents(on, config) {
      require("./cypress/plugins/index.js")(on, config);
      
      // Task para crear directorio de reportes
      on("task", {
        ensureReportsDir() {
          const dir = path.join(__dirname, "cypress/reports/junit");
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          return null;
        },
      });
      
      // Logs en CI
      if (process.env.CI) {
        console.log("[CI] Cypress E2E Tests configurado para CI/CD");
        console.log(`[CI] Base URL: ${config.baseUrl}`);
        console.log(`[CI] Node version: ${process.version}`);
      }
      
      return config;
    },
    
    // Retries en CI
    retries: process.env.CI ? 2 : 0,
    
    // Env variables
    env: {
      API_BASE_URL: process.env.API_BASE_URL || "http://localhost:3000/api",
      API_TIMEOUT: 15000,
      LOGIN_URL: "/login",
      DASHBOARD_URL: "/dashboard",
    },
  },
});
