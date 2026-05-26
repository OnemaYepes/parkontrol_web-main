# 🧪 Pruebas E2E con Cypress - Guía Completa

## 📋 Tabla de contenidos

1. [Introducción](#introducción)
2. [Instalación](#instalación)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Tipos de pruebas](#tipos-de-pruebas)
5. [Comandos personalizados](#comandos-personalizados)
6. [Ejecución de pruebas](#ejecución-de-pruebas)
7. [Mejores prácticas](#mejores-prácticas)
8. [Troubleshooting](#troubleshooting)

## Introducción

Este framework proporciona pruebas E2E (End-to-End) completas para la aplicación Parkontrol usando Cypress. Incluye:

- ✅ Pruebas de UI (Interfaz de usuario)
- ✅ Pruebas de API (Backend)
- ✅ Pruebas de Seguridad (SQL Injection, XSS, CSRF)
- ✅ Pruebas de Accesibilidad (WCAG 2.1 AA)
- ✅ Pruebas de Regresión (Flujos críticos)

## Instalación

### Requisitos previos

```bash
Node.js >= 14.0.0
npm >= 6.0.0
```

### Instalar dependencias

```bash
# Navegar a la carpeta de pruebas
cd frontend-angular/test

# Instalar Cypress y dependencias
npm install

# (Opcional) Instalar librerías adicionales
npm install --save-dev @axe-core/react cypress-axe
npm install --save-dev cypress-real-events
```

### Variables de entorno

Crear archivo `.env` en `frontend-angular/test/`:

```env
API_BASE_URL=http://localhost:3000/api
BASE_URL=http://localhost:4200
LOGIN_URL=/login
DASHBOARD_URL=/dashboard
API_TIMEOUT=10000
```

## Estructura del proyecto

```
cypress/
├── e2e/                          # Pruebas E2E
│   ├── ui/                       # Pruebas de interfaz
│   │   ├── login.cy.js
│   │   ├── dashboard.cy.js
│   │   └── vehiculos.cy.js
│   ├── api/                      # Pruebas de API
│   │   ├── auth.cy.js
│   │   └── vehiculos.cy.js
│   ├── security/                 # Pruebas de seguridad
│   │   ├── injection-xss.cy.js
│   │   └── auth-authorization.cy.js
│   ├── accessibility/            # Pruebas de accesibilidad
│   │   └── wcag.cy.js
│   └── regression/               # Pruebas de regresión
│       ├── critical-flows.cy.js
│       └── ui-consistency.cy.js
├── support/                      # Archivos de soporte
│   ├── e2e.js                   # Configuración global
│   ├── commands/                # Comandos personalizados
│   │   ├── auth.commands.js
│   │   ├── ui.commands.js
│   │   ├── api.commands.js
│   │   └── accessibility.commands.js
│   └── helpers/                 # Utilidades
│       ├── test-data.js
│       └── selectors.js
├── plugins/
│   └── index.js                 # Plugins de Cypress
├── fixtures/                     # Datos de prueba
│   └── example.json
└── screenshots/                  # Capturas de error
```

## Tipos de pruebas

### 1. Pruebas de UI

**Ubicación:** `cypress/e2e/ui/`

Prueban la interfaz de usuario, flujos de usuario y comportamiento visual.

```bash
# Ejecutar todas las pruebas de UI
npx cypress run --spec 'cypress/e2e/ui/**/*.cy.js'

# Ejecutar prueba específica
npx cypress run --spec 'cypress/e2e/ui/login.cy.js'
```

**Cobertura:**
- Formularios y validación
- Navegación
- Tablas y paginación
- Modales y diálogos
- Filtros y búsqueda

### 2. Pruebas de API

**Ubicación:** `cypress/e2e/api/`

Prueban los endpoints del backend sin interfaz.

```bash
# Ejecutar todas las pruebas de API
npx cypress run --spec 'cypress/e2e/api/**/*.cy.js'

# Prueba de autenticación
npx cypress run --spec 'cypress/e2e/api/auth.cy.js'
```

**Cobertura:**
- Autenticación y autorización
- CRUD operations
- Validación de datos
- Códigos de estado HTTP
- Manejo de errores

### 3. Pruebas de Seguridad

**Ubicación:** `cypress/e2e/security/`

Prueban vulnerabilidades comunes y mecanismos de seguridad.

```bash
# Ejecutar pruebas de seguridad
npx cypress run --spec 'cypress/e2e/security/**/*.cy.js'
```

**Cobertura:**
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Autenticación y autorización
- Session security
- Password security
- HTTPS/SSL

### 4. Pruebas de Accesibilidad

**Ubicación:** `cypress/e2e/accessibility/`

Prueban cumplimiento con estándares WCAG 2.1 AA.

```bash
# Ejecutar pruebas de accesibilidad
npx cypress run --spec 'cypress/e2e/accessibility/**/*.cy.js'
```

**Cobertura:**
- Navegación por teclado
- Etiquetas y semántica ARIA
- Contraste de colores
- Responsive design
- Screen readers
- Zoom y escalado

### 5. Pruebas de Regresión

**Ubicación:** `cypress/e2e/regression/`

Prueban flujos críticos completos para detectar cambios inesperados.

```bash
# Ejecutar pruebas de regresión
npx cypress run --spec 'cypress/e2e/regression/**/*.cy.js'
```

**Cobertura:**
- Flujos completos (registro → login → uso)
- Funcionalidad crítica
- Consistencia visual
- Validación de formularios
- Notificaciones
- Manejo de errores

## Comandos personalizados

### Autenticación

```javascript
// Login con UI
cy.login('email@example.com', 'password');

// Login vía API (más rápido)
cy.loginViaAPI('email@example.com', 'password');

// Logout
cy.logout();

// Verificar autenticación
cy.shouldBeLoggedIn();
cy.shouldNotBeLoggedIn();
```

### UI

```javascript
// Hacer click en elemento visible
cy.clickElement('[data-testid="button"]');

// Rellenar formulario
cy.fillForm({
  email: 'test@example.com',
  password: 'password123'
});

// Verificar visibilidad
cy.shouldBeVisible('[data-testid="element"]');
cy.shouldNotBeVisible('[data-testid="element"]');

// Esperar a que desaparezca
cy.waitForElementToDisappear('[data-testid="loading"]');

// Scrollear a elemento
cy.scrollToElement('[data-testid="element"]');

// Verificar texto
cy.shouldContainText('Texto esperado');

// Seleccionar dropdown
cy.selectDropdown('select[name="status"]', 'activo');

// Hover
cy.hoverElement('[data-testid="element"]');
```

### API

```javascript
// Requests GET
cy.apiGet('/endpoint').then(response => {
  expect(response.status).to.equal(200);
});

// Requests POST
cy.apiPost('/endpoint', { data: 'value' }).then(response => {
  expect(response.status).to.equal(201);
});

// Requests PUT
cy.apiPut('/endpoint/1', { data: 'updated' });

// Requests DELETE
cy.apiDelete('/endpoint/1');

// Requests PATCH
cy.apiPatch('/endpoint/1', { field: 'value' });

// Verificar respuesta
cy.apiResponseShouldContain(response, { id: 1, name: 'Test' });
```

### Accesibilidad

```javascript
// Verificar accesibilidad WCAG
cy.checkAccessibility();

// Verificar etiquetas ARIA
cy.shouldHaveAriaLabel('[data-testid="button"]', 'Enviar');

// Verificar que es enfocable por teclado
cy.shouldBeFocusable('[data-testid="button"]');

// Presionar tecla
cy.pressKey('Tab');
cy.pressKey('Enter');

// Verificar rol ARIA
cy.shouldHaveRole('[data-testid="element"]', 'button');

// Verificar que es requerido
cy.shouldBeRequired('input[name="email"]');

// Verificar que está deshabilitado/habilitado
cy.shouldBeDisabled('[data-testid="button"]');
cy.shouldBeEnabled('[data-testid="button"]');
```

## Ejecución de pruebas

### Modo interactivo

Abre la interfaz de Cypress para ejecutar pruebas manualmente:

```bash
npx cypress open
```

Selecciona:
1. E2E Testing
2. Elige navegador (Chrome, Firefox, etc.)
3. Selecciona archivo de prueba

### Modo headless (CI/CD)

Ejecuta todas las pruebas sin interfaz:

```bash
# Todas las pruebas
npx cypress run

# Todas las pruebas de UI
npx cypress run --spec 'cypress/e2e/ui/**/*.cy.js'

# Todas las pruebas de API
npx cypress run --spec 'cypress/e2e/api/**/*.cy.js'

# Todas las pruebas de Seguridad
npx cypress run --spec 'cypress/e2e/security/**/*.cy.js'

# Todas las pruebas de Accesibilidad
npx cypress run --spec 'cypress/e2e/accessibility/**/*.cy.js'

# Todas las pruebas de Regresión
npx cypress run --spec 'cypress/e2e/regression/**/*.cy.js'

# Prueba específica
npx cypress run --spec 'cypress/e2e/ui/login.cy.js'

# Con navegador específico
npx cypress run --browser chrome

# Generar videos y screenshots
npx cypress run --record
```

### Scripts en package.json

```json
{
  "scripts": {
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:ui": "cypress run --spec 'cypress/e2e/ui/**/*.cy.js'",
    "test:api": "cypress run --spec 'cypress/e2e/api/**/*.cy.js'",
    "test:security": "cypress run --spec 'cypress/e2e/security/**/*.cy.js'",
    "test:a11y": "cypress run --spec 'cypress/e2e/accessibility/**/*.cy.js'",
    "test:regression": "cypress run --spec 'cypress/e2e/regression/**/*.cy.js'"
  }
}
```

## Mejores prácticas

### 1. Usar selectores consistentes

```javascript
// ❌ Malo: frágil a cambios de texto
cy.contains('Guardar').click();

// ✅ Bueno: específico y estable
cy.get('[data-testid="btn-save"]').click();
```

### 2. Esperar explícitamente

```javascript
// ❌ Malo: puede ser frágil
cy.get('[data-testid="modal"]').click();

// ✅ Bueno: esperar a que esté visible
cy.get('[data-testid="modal"]', { timeout: 10000 }).should('be.visible').click();
```

### 3. Usar comandos personalizados

```javascript
// ❌ Repetitivo
cy.get('input[name="email"]').type('test@example.com');
cy.get('input[name="password"]').type('password123');
cy.get('button[type="submit"]').click();

// ✅ Limpio y reutilizable
cy.login('test@example.com', 'password123');
```

### 4. Organizar pruebas por describe blocks

```javascript
describe('Login', () => {
  describe('Validación', () => {
    it('debería mostrar error con email vacío');
  });
  
  describe('Flujo exitoso', () => {
    it('debería loguear con credenciales válidas');
  });
});
```

### 5. Usar hooks apropiadamente

```javascript
describe('Dashboard', () => {
  beforeEach(() => {
    // Se ejecuta antes de cada prueba
    cy.login();
  });
  
  afterEach(() => {
    // Se ejecuta después de cada prueba
    cy.logout();
  });
  
  it('should display dashboard');
});
```

### 6. Evitar esperas hardcodeadas

```javascript
// ❌ Malo
cy.wait(5000);

// ✅ Bueno
cy.get('[data-testid="loading"]').should('not.exist');
```

### 7. Hacer pruebas independientes

```javascript
// ❌ Malo: depende de otra prueba
beforeEach(() => {
  // No crear datos en otra prueba
});

// ✅ Bueno: crear datos antes de cada prueba
beforeEach(() => {
  cy.apiPost('/vehiculos', vehicleData);
});
```

## Troubleshooting

### Problema: Prueba falla en CI pero pasa localmente

**Solución:**
- Aumentar timeouts: `defaultCommandTimeout: 15000`
- Agregar esperas explícitas
- Verificar variables de entorno en CI

### Problema: Selector no encontrado

**Verificar:**
```javascript
// Abrir DevTools en Cypress
cy.get('[data-testid="element"]').debug();

// O tomar screenshot
cy.screenshot('selector-debug');
```

### Problema: Flakiness (pruebas intermitentes)

**Soluciones:**
- No usar `cy.wait()` sin argumentos
- Agregar `timeout` explícitos
- Usar selectores más específicos
- Verificar que el servidor está corriendo

### Problema: Token JWT expirado

**Solución:**
```javascript
beforeEach(() => {
  // Generar token fresco
  cy.loginViaAPI();
});
```

### Problema: CORS en pruebas de API

**Solución:**
```javascript
cy.apiGet('/endpoint', {
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
});
```

## Recursos adicionales

- 📚 [Documentación oficial de Cypress](https://docs.cypress.io/)
- ♿ [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- 🔒 [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- 🎯 [Testing Best Practices](https://docs.cypress.io/guides/references/best-practices)

---

**Última actualización:** Mayo 2024
