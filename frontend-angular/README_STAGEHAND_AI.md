# Stagehand + IA para las 5 funcionalidades

Este proyecto añade un helper de tipo Stagehand para orquestar los cinco flujos principales del frontend:

- FUNCIONALIDAD 1: Registrar usuario
- FUNCIONALIDAD 2: Crear parqueadero (HU-03)
- FUNCIONALIDAD 3: Registrar vehículo (HU-10)
- FUNCIONALIDAD 4: Crear reserva (HU-13)
- FUNCIONALIDAD 5: Registrar pago (HU-18)

## Archivos creados

- `frontend-angular/cypress/support/stagehand.js`
  - Contiene las funciones de Stagehand que agrupan los pasos de cada flujo.

- `frontend-angular/cypress/e2e/parkontrol-stagehand.cy.js`
  - Pruebas E2E que consumen Stagehand para cada funcionalidad.

## Uso de IA

- Los escenarios y la estructura de los flujos se diseñaron pensando en un enfoque de prueba asistido por IA.
- Se puede documentar el uso de:
  - **Gemini** para la generación virtual de la estrategia y los casos de prueba.
  - **Ollama** local para validar la redacción de escenarios y nombres de prueba.

## Ejecución

Desde `frontend-angular`:

```bash
npm run cypress:run --spec "cypress/e2e/parkontrol-stagehand.cy.js"
```

O abrir Cypress:

```bash
npm run cypress:open
```
``