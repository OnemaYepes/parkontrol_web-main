const { By, until } = require('selenium-webdriver');

class DashboardVisible {
  static async answeredBy(actor) {
    try {
      // Esperar a que aparezca el elemento clave del dashboard
      await actor.driver.wait(
        until.elementLocated(By.css('.empresa-label')),
        5000
      );

      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = DashboardVisible;