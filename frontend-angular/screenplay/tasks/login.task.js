const { By, until } = require('selenium-webdriver');

class LoginTask {
  static async performAs(actor) {
    await actor.driver.get('http://127.0.0.1:4200/login');

    const correo = await actor.driver.wait(
      until.elementLocated(By.css('input[formControlName="correo"]')),
      10000
    );

    const contrasena = await actor.driver.wait(
      until.elementLocated(By.css('input[formControlName="contrasena"]')),
      10000
    );

    await correo.sendKeys('juan@gmail.com');
    await contrasena.sendKeys('Prueba123456');

    const boton = await actor.driver.findElement(By.css('button[type="submit"]'));
    await boton.click();

    // Espera a que la app procese el login y salga de /login
    await actor.driver.wait(async () => {
      const url = await actor.driver.getCurrentUrl();
      return !url.includes('/login');
    }, 15000, 'El login no redirigió — verifica credenciales o que el backend esté corriendo');
  }
}

module.exports = LoginTask;