const adminUser = {
  id: 1,
  correo: 'admin@demo.com',
  nombreRol: 'ADMINISTRADOR',
  idEmpresa: 10
};

describe('Inicio de sesion', () => {
  it('permite iniciar sesion y navegar al dashboard', () => {
    cy.stubLogin(adminUser);

    cy.intercept('GET', '**/companies/*', { fixture: 'empresa.json' }).as('getEmpresa');
    cy.intercept('GET', '**/views/ocupacion*', { fixture: 'ocupacion.json' });
    cy.intercept('GET', '**/reservations/activas', { fixture: 'reservas-activas.json' });
    cy.intercept('GET', '**/views/ingresos*', { fixture: 'ingresos.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.visit('/login');

    cy.get('[data-cy=login-email]').type('admin@demo.com', { force: true });
    cy.get('[data-cy=login-password]').type('password123', { force: true });
    cy.get('[data-cy=login-submit]').click();

    cy.wait('@login');
    cy.url().should('include', '/dashboard');
  });
});
