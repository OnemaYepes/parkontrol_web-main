const { By, until } = require('selenium-webdriver');

class loginError {
  static async answeredBy(actor) {
    try {
      // Espera a que aparezca el mensaje de error
      await actor.driver.wait(
        until.elementLocated(By.css('.mensaje-error')),
        10000
      );

      return true;
    } catch {
      return false;
    }
  }
}

module.exports = loginError;