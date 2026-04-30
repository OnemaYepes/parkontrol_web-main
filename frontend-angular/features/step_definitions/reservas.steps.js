const { Given, Then, After } = require('@cucumber/cucumber');
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const { setDefaultTimeout } = require('@cucumber/cucumber');

require('chromedriver');
setDefaultTimeout(60000);

const Actor = require('../../screenplay/actor');
const LoginTask = require('../../screenplay/tasks/login.task');

const RESERVAS_URL = 'http://angular-frontend/reservas';

let actor;

Given('el usuario ha iniciado sesión y está en la página de reservas', async function () {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-gpu');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  actor = new Actor('Juan Manuel Yepes', driver);
  await LoginTask.performAs(actor);
  await actor.driver.get(RESERVAS_URL);

  // Espera a que desaparezca el spinner
  await actor.driver.wait(async () => {
    const spinners = await actor.driver.findElements(By.css('mat-spinner'));
    return spinners.length === 0;
  }, 15000, 'El spinner de carga no desapareció');
});

Then('debería estar en la página de reservas', async function () {
  // Verifica URL
  const url = await actor.driver.getCurrentUrl();
  assert.ok(
    url.includes('/reservas'),
    `Se esperaba estar en /reservas pero la URL es: ${url}`
  );

});