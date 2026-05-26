#!/bin/bash

# ============================================
# Script de ejecución de pruebas E2E
# ============================================

set -e

echo "🧪 Iniciando pruebas E2E con Cypress..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar que el servidor está corriendo
echo -e "${BLUE}Verificando servidor en http://localhost:4200...${NC}"
if ! curl -s http://localhost:4200 > /dev/null; then
  echo -e "${RED}Error: El servidor no está corriendo en http://localhost:4200${NC}"
  echo -e "${YELLOW}Inicia el servidor con: ng serve${NC}"
  exit 1
fi

# Verificar que la API está corriendo
echo -e "${BLUE}Verificando API en http://localhost:3000...${NC}"
if ! curl -s http://localhost:3000/health > /dev/null 2>&1; then
  echo -e "${YELLOW}Warning: La API no está corriendo en http://localhost:3000${NC}"
fi

# Función para ejecutar pruebas
run_tests() {
  local test_type=$1
  local spec=$2
  local label=$3
  
  echo -e "\n${BLUE}════════════════════════════════════════${NC}"
  echo -e "${BLUE}Ejecutando: $label${NC}"
  echo -e "${BLUE}════════════════════════════════════════${NC}\n"
  
  if npx cypress run --spec "$spec"; then
    echo -e "${GREEN}✓ $label completadas exitosamente${NC}"
    return 0
  else
    echo -e "${RED}✗ $label fallaron${NC}"
    return 1
  fi
}

# Determinar qué pruebas ejecutar
if [ "$1" = "" ] || [ "$1" = "all" ]; then
  echo -e "${YELLOW}Ejecutando todas las pruebas...${NC}"
  npx cypress run
  
elif [ "$1" = "ui" ]; then
  run_tests "ui" "cypress/e2e/ui/**/*.cy.js" "Pruebas de UI"
  
elif [ "$1" = "api" ]; then
  run_tests "api" "cypress/e2e/api/**/*.cy.js" "Pruebas de API"
  
elif [ "$1" = "security" ]; then
  run_tests "security" "cypress/e2e/security/**/*.cy.js" "Pruebas de Seguridad"
  
elif [ "$1" = "a11y" ]; then
  run_tests "a11y" "cypress/e2e/accessibility/**/*.cy.js" "Pruebas de Accesibilidad"
  
elif [ "$1" = "regression" ]; then
  run_tests "regression" "cypress/e2e/regression/**/*.cy.js" "Pruebas de Regresión"
  
elif [ "$1" = "open" ]; then
  echo -e "${BLUE}Abriendo Cypress...${NC}"
  npx cypress open
  
elif [ "$1" = "headless" ]; then
  echo -e "${YELLOW}Ejecutando pruebas en modo headless...${NC}"
  npx cypress run --headless
  
else
  echo -e "${RED}Opción no válida: $1${NC}"
  echo -e "${YELLOW}Uso: ./run-tests.sh [all|ui|api|security|a11y|regression|open|headless]${NC}"
  exit 1
fi

echo -e "\n${GREEN}✓ Pruebas completadas${NC}"
