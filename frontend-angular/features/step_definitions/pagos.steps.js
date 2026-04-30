const { Given, Then, After } = require('@cucumber/cucumber');
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const { setDefaultTimeout } = require('@cucumber/cucumber');

require('chromedriver');
setDefaultTimeout(60000);

const Actor = require('../../screenplay/actor');
const LoginTask = require('../../screenplay/tasks/login.task');

const PAGOS_URL = 'http://127.0.0.1:4200/pagos';

let actor;

Given('el usuario ha iniciado sesión y está en la página de pagos', async function () {
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
  await actor.driver.get(PAGOS_URL);

  // Espera a que desaparezca el spinner
  await actor.driver.wait(async () => {
    const spinners = await actor.driver.findElements(By.css('mat-spinner'));
    return spinners.length === 0;
  }, 15000, 'El spinner de carga no desapareció');
});

Then('debería estar en la página de pagos', async function () {
  // Verifica URL
  const url = await actor.driver.getCurrentUrl();
  assert.ok(
    url.includes('/pagos'),
    `Se esperaba estar en /pagos pero la URL es: ${url}`
  );

  // Verifica contenedor principal
  const contenedor = await actor.driver.findElements(By.css('.pagos-container'));
  assert.ok(contenedor.length > 0, 'El contenedor de pagos no está en la página');

  // Verifica que el botón "Nuevo Pago" está presente
  const boton = await actor.driver.findElements(
    By.xpath(`//button[contains(., 'Nuevo Pago')]`)
  );
  assert.ok(boton.length > 0, 'El botón "Nuevo Pago" no está en la página');
});