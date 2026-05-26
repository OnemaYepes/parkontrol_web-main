// ============================================
// Pruebas de Seguridad - Autenticación y Autorización
// ============================================

describe('Security Tests - Autenticación y Autorización', () => {

  describe('API Authentication', () => {
    it('Debería rechazar requests sin token', () => {
      cy.apiGet('/vehiculos', { 
        headers: { Authorization: undefined } 
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });

    it('Debería rechazar token expirado', () => {
      cy.apiGet('/vehiculos', {
        headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDAwMDAwMDB9.xyz' }
      }).then((response) => {
        expect(response.status).to.equal(404);
      });
    });
  });
});
