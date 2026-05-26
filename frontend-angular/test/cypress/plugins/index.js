// ============================================
// Plugins de Cypress
// ============================================

module.exports = (on, config) => {
  // Evento para hacer logs
  on('task', {
    log(message) {
      console.log(`[Cypress Log] ${message}`);
      return null;
    },
  });

  // Evento para hacer logs de warning
  on('task', {
    logWarning(message) {
      console.warn(`[Cypress Warning] ${message}`);
      return null;
    },
  });

  // Evento para hacer logs de error
  on('task', {
    logError(message) {
      console.error(`[Cypress Error] ${message}`);
      return null;
    },
  });

  // Evento para ejecutar scripts personalizados
  on('task', {
    executeScript(script) {
      // Ejecutar scripts personalizados desde las pruebas
      return null;
    },
  });

  // Evento para capturar archivos
  on('task', {
    saveFile({ filePath, content }) {
      const fs = require('fs');
      const path = require('path');
      
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, content);
      return null;
    },
  });

  // Evento para leer archivos
  on('task', {
    readFile(filePath) {
      const fs = require('fs');
      try {
        return fs.readFileSync(filePath, 'utf8');
      } catch (error) {
        return null;
      }
    },
  });

  return config;
};
