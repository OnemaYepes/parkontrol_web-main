@echo off
REM ============================================
REM Script de ejecución de pruebas E2E para Windows
REM ============================================

setlocal enabledelayedexpansion

echo.
echo Iniciando pruebas E2E con Cypress...
echo.

REM Colores
for /F %%A in ('echo prompt $H ^| cmd') do set "BS=%%A"

REM Verificar que el servidor está corriendo
echo Verificando servidor en http://localhost:4200...
timeout /t 1 /nobreak > nul

REM Determinar qué pruebas ejecutar
if "%1%"=="" goto all
if "%1%"=="all" goto all
if "%1%"=="ui" goto ui
if "%1%"=="api" goto api
if "%1%"=="security" goto security
if "%1%"=="a11y" goto a11y
if "%1%"=="regression" goto regression
if "%1%"=="open" goto open
if "%1%"=="headless" goto headless

echo Error: Opcion no valida: %1%
echo.
echo Uso: run-tests.bat [all^|ui^|api^|security^|a11y^|regression^|open^|headless]
pause
exit /b 1

:all
echo Ejecutando todas las pruebas...
call npx cypress run
goto end

:ui
echo Ejecutando pruebas de UI...
call npx cypress run --spec "cypress/e2e/ui/**/*.cy.js"
goto end

:api
echo Ejecutando pruebas de API...
call npx cypress run --spec "cypress/e2e/api/**/*.cy.js"
goto end

:security
echo Ejecutando pruebas de Seguridad...
call npx cypress run --spec "cypress/e2e/security/**/*.cy.js"
goto end

:a11y
echo Ejecutando pruebas de Accesibilidad...
call npx cypress run --spec "cypress/e2e/accessibility/**/*.cy.js"
goto end

:regression
echo Ejecutando pruebas de Regresión...
call npx cypress run --spec "cypress/e2e/regression/**/*.cy.js"
goto end

:open
echo Abriendo Cypress...
call npx cypress open
goto end

:headless
echo Ejecutando pruebas en modo headless...
call npx cypress run --headless
goto end

:end
echo.
echo Pruebas completadas
pause
