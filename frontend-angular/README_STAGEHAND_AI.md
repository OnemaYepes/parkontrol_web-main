# Stagehand + IA para las 5 funcionalidades

Este proyecto añade un helper de tipo Stagehand para orquestar los cinco flujos principales del frontend:

- FUNCIONALIDAD 1: Registrar usuario
- FUNCIONALIDAD 2: Crear parqueadero (HU-03)
- FUNCIONALIDAD 3: Registrar vehículo (HU-10)
- FUNCIONALIDAD 4: Crear reserva (HU-13)
- FUNCIONALIDAD 5: Registrar pago (HU-18)

## ¿Dónde está `act()`, `extract()`, `observe()` y `agent()`?

Estas primitivas se implementaron en `frontend-angular/cypress/support/stagehand.js`.

- `act(instruction)`: ejecuta instrucciones de usuario en lenguaje natural sobre la UI.
- `observe()`: inspecciona la página actual y reporta estado como URL, título y si hay cargando.
- `extract(schema)`: extrae datos de la página con validación Zod.
- `agent({ goal, data })`: completa flujos de alto nivel según un objetivo final.

## Archivos clave

- `frontend-angular/cypress/support/stagehand.js`
- `frontend-angular/cypress/support/ai-config.js`
- `frontend-angular/cypress/e2e/parkontrol-stagehand.cy.js`
- `frontend-angular/package.json`
- `frontend-angular/.env.example`

## Configuración de entorno

Este proyecto usa un helper local de Stagehand. No existe un CLI `npx stagehand@latest init` válido en el paquete publicado `stagehand` del registro npm, porque ese paquete no expone el flujo AI/agent que buscas.

Para habilitar la configuración de IA local:

1. Copia `frontend-angular/.env.example` a `frontend-angular/.env`
2. Define cualquier variable necesaria para tu proveedor de IA si la usas.
3. Ejecuta `npm install` en `frontend-angular` para instalar `dotenv`

La configuración se carga automáticamente desde `frontend-angular/cypress/support/ai-config.js`.

## Qué hace cada parte

- `stagehand.js` define los comandos Stagehand y la lógica para tomar decisiones autónomas.
- `parkontrol-stagehand.cy.js` usa `agent()` para ejecutar los cinco casos y muestra `observe()`/`extract()`.
- `package.json` agrega `zod` para la validación de extracción de datos.

## Ejecución

Desde `frontend-angular`:

```bash
npm install
npm run cypress:run --spec "cypress/e2e/parkontrol-stagehand.cy.js"
```

O abrir Cypress:

```bash
npm run cypress:open
```
``