# 🚀 Guía Rápida - Pruebas E2E Cypress

## Instalación rápida (5 minutos)

### 1. Instalar Cypress
```bash
cd frontend-angular/test
npm install
```

### 2. Inicia los servidores
```bash
# Terminal 1: Backend
cd backend
npm install
npm run start

# Terminal 2: Frontend
cd frontend-angular
npm start

# Terminal 3: Pruebas (fronten-angular/test)
```

### 3. Ejecutar pruebas
```bash
# Abrir interfaz gráfica (recomendado para comenzar)
npm run test:open

# O ejecutar todas las pruebas
npm run test

# O ejecutar por tipo
npm run test:ui          # Solo UI
npm run test:api         # Solo API
npm run test:security    # Solo Seguridad
npm run test:a11y        # Solo Accesibilidad
npm run test:regression  # Solo Regresión
```

## Estructura de pruebas

```
cypress/e2e/
├── ui/                    # Pruebas de interfaz
│   ├── login.cy.js       # Login y autenticación
│   ├── dashboard.cy.js   # Dashboard principal
│   └── vehiculos.cy.js   # Gestión de vehículos
├── api/                   # Pruebas de API
│   ├── auth.cy.js        # Endpoints de autenticación
│   └── vehiculos.cy.js   # CRUD de vehículos
├── security/              # Pruebas de seguridad
│   ├── injection-xss.cy.js     # SQL Injection, XSS
│   └── auth-authorization.cy.js # Autenticación, autorización
├── accessibility/         # Pruebas de accesibilidad (A11y)
│   └── wcag.cy.js        # WCAG 2.1 AA compliance
└── regression/            # Pruebas de regresión
    ├── critical-flows.cy.js    # Flujos críticos completos
    └── ui-consistency.cy.js    # Consistencia visual
```

## Ejemplos de uso

### Ejemplo 1: Prueba simple de login
```javascript
describe('Login Tests', () => {
  it('Debería loguear con credenciales válidas', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Verificar que estamos en el dashboard
    cy.url().should('include', '/dashboard');
  });
});
```

### Ejemplo 2: Usando comandos personalizados
```javascript
describe('Dashboard Tests', () => {
  beforeEach(() => {
    // Login automático
    cy.login('test@example.com', 'password123');
  });
  
  it('Debería mostrar dashboard', () => {
    cy.visit('/dashboard');
    cy.shouldBeVisible('[data-testid="dashboard"]');
  });
});
```

### Ejemplo 3: Pruebas de API
```javascript
describe('API Tests', () => {
  beforeEach(() => {
    // Login vía API (más rápido)
    cy.loginViaAPI();
  });
  
  it('Debería obtener lista de vehículos', () => {
    cy.apiGet('/vehiculos').then(response => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });
});
```

### Ejemplo 4: Pruebas de seguridad
```javascript
describe('Security Tests', () => {
  it('Debería prevenir SQL Injection', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type("' OR '1'='1");
    cy.get('button[type="submit"]').click();
    
    // No debería loguear
    cy.url().should('include', '/login');
  });
});
```

### Ejemplo 5: Pruebas de accesibilidad
```javascript
describe('Accessibility Tests', () => {
  it('Debería navegar por teclado', () => {
    cy.login();
    cy.visit('/dashboard');
    
    // Presionar Tab para navegar
    cy.get('body').type('{Tab}');
    cy.focused().should('be.visible');
  });
});
```

## Comandos personalizados disponibles

### Autenticación
```javascript
cy.login(email, password)           // Login con UI
cy.loginViaAPI(email, password)     // Login vía API
cy.logout()                          // Logout
cy.shouldBeLoggedIn()               // Verificar autenticación
cy.shouldNotBeLoggedIn()            // Verificar no autenticado
```

### UI
```javascript
cy.clickElement(selector)            // Click en elemento visible
cy.fillForm(data)                    // Rellenar formulario
cy.shouldBeVisible(selector)         // Verificar visibilidad
cy.shouldNotBeVisible(selector)      // Verificar no visible
cy.scrollToElement(selector)         // Scrollear a elemento
cy.shouldContainText(text)           // Verificar texto
cy.selectDropdown(selector, value)   // Seleccionar dropdown
cy.hoverElement(selector)            // Hover
```

### API
```javascript
cy.apiGet(endpoint)                  // GET request
cy.apiPost(endpoint, body)           // POST request
cy.apiPut(endpoint, body)            // PUT request
cy.apiDelete(endpoint)               // DELETE request
cy.apiPatch(endpoint, body)          // PATCH request
cy.apiResponseShouldContain(...)     // Verificar respuesta
```

### Accesibilidad
```javascript
cy.checkAccessibility()              // Verificar WCAG
cy.shouldHaveAriaLabel(selector)     // Verificar aria-label
cy.shouldBeFocusable(selector)       // Verificar focusable
cy.pressKey(key)                     // Presionar tecla
cy.shouldHaveRole(selector, role)    // Verificar ARIA role
```

## Debugging

### Ver elemento en tiempo real
```javascript
cy.get('[data-testid="button"]').debug();
cy.get('[data-testid="button"]').pause(); // Pausar ejecución
```

### Tomar screenshot
```javascript
cy.screenshot('nombre-del-test');
```

### Ver eventos de Cypress
```javascript
// En la consola de Cypress
cy.log('Mi log custom');
```

## Tips útiles

1. **Usar data-testid**: Agrega atributos `data-testid` a elementos HTML para selectores más estables
   ```html
   <button data-testid="login-button">Login</button>
   ```

2. **Seleccionar por atributo**: Mejor que por texto o clases
   ```javascript
   // ✅ Bueno
   cy.get('[data-testid="button"]');
   
   // ❌ Malo
   cy.contains('Click me');
   ```

3. **Esperar explícitamente**: No dejes que Cypress espere por defecto
   ```javascript
   // ✅ Bueno
   cy.get('[data-testid="modal"]', { timeout: 10000 }).should('be.visible');
   
   // ❌ Malo
   cy.wait(5000);
   ```

4. **Hooks para setup/cleanup**:
   ```javascript
   beforeEach(() => { /* Antes de cada test */ });
   afterEach(() => { /* Después de cada test */ });
   before(() => { /* Una sola vez al inicio */ });
   after(() => { /* Una sola vez al final */ });
   ```

## Verificar que está funcionando

1. ✅ Frontend corre en http://localhost:4200
2. ✅ Backend corre en http://localhost:3000
3. ✅ Puedes acceder a /login
4. ✅ Cypress abre sin errores

## Recursos

- 📚 [Documentación Cypress oficial](https://docs.cypress.io/)
- 📖 [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- 🎯 [Cypress API Reference](https://docs.cypress.io/api/table-of-contents)
- ♿ [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Problemas comunes

| Problema | Solución |
|----------|----------|
| "Elemento no encontrado" | Aumentar timeout: `{ timeout: 15000 }` |
| "Request timeout" | Verificar que API está corriendo |
| "Page not found" | Verificar que frontend está en 4200 |
| "Flaky tests" | Usar selectores específicos, no `cy.wait()` |

---

**¡Listo para empezar! 🎉**
