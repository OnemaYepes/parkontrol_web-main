// ============================================
// Pruebas de UI - Login y Autenticación
// ============================================

describe('UI Tests - Login y Autenticación', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('Debería mostrar el formulario de login', () => {
    cy.get('input[formControlName="correo"]').should('be.visible');
    cy.get('input[formControlName="contrasena"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('Debería mostrar errores de validación', () => {
    cy.get('input[formControlName="correo"]').focus().blur();
    cy.get('input[formControlName="contrasena"]').focus().blur();
    cy.contains('El correo es requerido').should('be.visible');
    cy.contains('La contraseña es requerida').should('be.visible');
  });

  it('Debería rechazar credenciales inválidas', () => {
    cy.get('input[formControlName="correo"]').type('fake@test.com', { force: true });
    cy.get('input[formControlName="contrasena"]').type('123456', { force: true });
    cy.get('button[type="submit"]').click();
    cy.get('.mensaje-error').should('be.visible');
  });

  it('Debería loguear exitosamente con credenciales válidas', () => {
    cy.get('input[formControlName="correo"]').type('juan@gmail.com', { force: true });
    cy.get('input[formControlName="contrasena"]').type('Prueba123456', { force: true });
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});
