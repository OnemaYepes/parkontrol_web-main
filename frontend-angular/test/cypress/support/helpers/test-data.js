// ============================================
// Helper: Utilidades para datos de prueba
// ============================================

export const testData = {
  validUser: {
    email: 'test@parkontrol.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
  },
  
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
  
  sqlInjectionPayloads: [
    "' OR '1'='1",
    "'; DROP TABLE users--",
    "admin'--",
    "' OR 1=1--",
  ],
  
  xssPayloads: [
    '<script>alert("XSS")</script>',
    '<img src=x onerror="alert(\'XSS\')">',
    'javascript:alert("XSS")',
  ],
};

/**
 * Generar datos aleatorios para pruebas
 */
export const generateTestData = {
  email: () => `test${Date.now()}@parkontrol.com`,
  name: () => `TestUser${Math.random().toString(36).substr(2, 9)}`,
  phone: () => `+573${Math.floor(Math.random() * 1000000000)}`,
  plateNumber: () => `ABC${Math.floor(Math.random() * 9999)}`,
};

/**
 * Esperar un tiempo específico (para debugging)
 */
export const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Obtener fecha en formato yyyy-MM-dd
 */
export const getFormattedDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtener hora en formato HH:mm
 */
export const getFormattedTime = (date = new Date()) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};
