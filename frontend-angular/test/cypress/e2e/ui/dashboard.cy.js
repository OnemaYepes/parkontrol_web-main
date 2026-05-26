// ============================================
// Pruebas de UI - Dashboard
// ============================================

describe('UI Tests - Dashboard', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard');
  });

  it('Debería mostrar el dashboard después de loguearse', () => {
    cy.get('a.active span').click();
  });

});


