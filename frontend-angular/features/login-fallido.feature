Feature: Login fallido

  Scenario: Usuario ingresa credenciales incorrectas
    Given el usuario está en la página de login
    When ingresa credenciales inválidas
    Then debería ver un mensaje de error