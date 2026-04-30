const { By, until } = require('selenium-webdriver');

class loginFailTask {
  static async performAs(actor) {
    await actor.driver.get('http://localhost:4200/login');

    const correo = await actor.driver.wait(
      until.elementLocated(By.css('input[formControlName="correo"]')),
      10000
    );

    const contrasena = await actor.driver.wait(
      until.elementLocated(By.css('input[formControlName="contrasena"]')),
      10000
    );

    await correo.sendKeys('juan@gmail.com');
    await contrasena.sendKeys('malpassword123');

    const boton = await actor.driver.findElement(By.css('button[type="submit"]'));
    await boton.click();
  }
}

module.exports = loginFailTask;