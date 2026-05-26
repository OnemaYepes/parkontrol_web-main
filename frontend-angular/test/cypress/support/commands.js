Cypress.Commands.add('login', () => {

  cy.session('usuario-logueado', () => {

    cy.visit('/login');

    cy.get('input[formControlName="correo"]')
      .type('juan@gmail.com', { force: true });

    cy.get('input[formControlName="contrasena"]')
      .type('Prueba123456', { force: true });

    cy.get('button[type="submit"]')
      .click();

    cy.url().should('not.include', '/login');
  });
});

// ============================================
// Comandos de API Testing
// ============================================

const API_BASE_URL = Cypress.env('API_BASE_URL');

/**
 * Hacer una solicitud GET a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {object} options - Opciones adicionales
 */
Cypress.Commands.add('apiGet', (endpoint, options = {}) => {
  return cy.request({
    method: 'GET',
    url: `${API_BASE_URL}${endpoint}`,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
    failOnStatusCode: false,
  });
});

/**
 * Hacer una solicitud POST a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {object} body - Cuerpo de la solicitud
 * @param {object} options - Opciones adicionales
 */
Cypress.Commands.add('apiPost', (endpoint, body, options = {}) => {
  return cy.request({
    method: 'POST',
    url: `${API_BASE_URL}${endpoint}`,
    body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
    failOnStatusCode: false,
  });
});

/**
 * Hacer una solicitud PUT a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {object} body - Cuerpo de la solicitud
 * @param {object} options - Opciones adicionales
 */
Cypress.Commands.add('apiPut', (endpoint, body, options = {}) => {
  return cy.request({
    method: 'PUT',
    url: `${API_BASE_URL}${endpoint}`,
    body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
    failOnStatusCode: false,
  });
});

/**
 * Hacer una solicitud DELETE a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {object} options - Opciones adicionales
 */
Cypress.Commands.add('apiDelete', (endpoint, options = {}) => {
  return cy.request({
    method: 'DELETE',
    url: `${API_BASE_URL}${endpoint}`,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
    failOnStatusCode: false,
  });
});

/**
 * Hacer una solicitud PATCH a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {object} body - Cuerpo de la solicitud
 * @param {object} options - Opciones adicionales
 */
Cypress.Commands.add('apiPatch', (endpoint, body, options = {}) => {
  return cy.request({
    method: 'PATCH',
    url: `${API_BASE_URL}${endpoint}`,
    body,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
    failOnStatusCode: false,
  });
});

/**
 * Verificar que la respuesta tiene un código de estado específico
 * @param {object} response - Respuesta de la API
 * @param {number} status - Código de estado esperado
 */
Cypress.Commands.add('apiStatusShouldBe', (response, status) => {
  expect(response.status).to.equal(status);
});

/**
 * Obtener el token del localStorage
 */
function getToken() {
  let token = '';
  cy.window().then((win) => {
    token = win.localStorage.getItem('access_token') || '';
  });
  return token;
}

/**
 * Verificar que la API responde con datos válidos
 * @param {object} response - Respuesta de la API
 * @param {object} expectedData - Datos esperados
 */
Cypress.Commands.add('apiResponseShouldContain', (response, expectedData) => {
  expect(response.body).to.deep.include(expectedData);
});

// Robust typing helper to work around Material decorations that overlap inputs
Cypress.Commands.add('robustType', (selector, value) => {
  return cy.get(selector, { timeout: 10000 }).then(($el) => {
    const el = cy.wrap($el);
    el.scrollIntoView();
    el.click({ force: true });
    el.clear({ force: true });
    el.type(String(value), { force: true });
    return el;
  });
});