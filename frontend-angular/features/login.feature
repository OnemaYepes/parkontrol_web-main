Feature: Login en el sistema

  Scenario: Usuario inicia sesión correctamente
    Given el usuario está en la página de login
    When ingresa sus credenciales válidas
    Then debería ver el dashboard