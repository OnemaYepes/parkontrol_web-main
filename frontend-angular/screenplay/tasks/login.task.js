const { By, until } = require('selenium-webdriver');

class LoginTask {
  static async performAs(actor) {
    await actor.driver.get('http://localhost:4200/login');

    // Esperar campo correo
    const correo = await actor.driver.wait(
      until.elementLocated(By.css('input[formControlName="correo"]')),
      10000
    );

    // Esperar campo contraseña
    const contrasena = await actor.driver.wait(
      until.elementLocated(By.css('input[formControlName="contrasena"]')),
      10000
    );

    await correo.sendKeys('juan@gmail.com');
    await contrasena.sendKeys('Prueba123456');

    // Botón submit
    const boton = await actor.driver.findElement(By.css('button[type="submit"]'));
    await boton.click();
  }
}

module.exports = LoginTask;