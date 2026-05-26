// ============================================
// Pruebas de API - Autenticación
// ============================================

describe('API Tests - Autenticación', () => {
  
  it('Debería obtener token con credenciales válidas', () => {
    cy.apiPost('/auth/login', {
      correo: 'juan@gmail.com',
      contrasena: 'Prueba123456',
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('access_token');
    });
  });

  it('Debería rechazar login con email inválido', () => {
    cy.apiPost('/auth/login', {
      email: 'noexiste@parkontrol.com',
      password: 'TestPassword123!',
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('message');
    });
  });

  it('Debería rechazar login con contraseña inválida', () => {
    cy.apiPost('/auth/login', {
      email: 'test@parkontrol.com',
      password: 'WrongPassword123!',
    }).then((response) => {
      expect(response.status).to.equal(400);
    });
  });
});
