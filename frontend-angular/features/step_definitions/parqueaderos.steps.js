const { Given, Then, After } = require('@cucumber/cucumber');
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const { setDefaultTimeout } = require('@cucumber/cucumber');

require('chromedriver');
setDefaultTimeout(60000);

const Actor = require('../../screenplay/actor');
const LoginTask = require('../../screenplay/tasks/login.task');

const PARQUEADEROS_URL = 'http://127.0.0.1:4200/parqueaderos';

let actor;

Given('el usuario ha iniciado sesión y está en la página de parqueaderos', async function () {
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

  // LoginTask ahora espera a que el redirect ocurra
  await LoginTask.performAs(actor);

  // Navega a parqueaderos (el token ya está guardado)
  await actor.driver.get(PARQUEADEROS_URL);

  await actor.driver.wait(async () => {
    const spinners = await actor.driver.findElements(By.css('mat-spinner'));
    return spinners.length === 0;
  }, 15000, 'El spinner de carga no desapareció');
});

Then('debería estar en la página de parqueaderos', async function () {
  const url = await actor.driver.getCurrentUrl();
  assert.ok(
    url.includes('/parqueaderos'),
    `Se esperaba estar en /parqueaderos pero la URL es: ${url}`
  );

  // Verifica que el contenedor principal existe
  const contenedor = await actor.driver.findElements(By.css('.parqueaderos-container'));
  assert.ok(contenedor.length > 0, 'El contenedor de parqueaderos no está en la página');
});