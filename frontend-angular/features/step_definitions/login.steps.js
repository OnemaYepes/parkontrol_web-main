const { Given, When, Then, After } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const { setDefaultTimeout } = require('@cucumber/cucumber');

require('chromedriver'); // ← ESTO FALTABA

setDefaultTimeout(60000); // ← aumenta a 60s por si el arranque es lento

const Actor = require('../../screenplay/actor');
const LoginTask = require('../../screenplay/tasks/login.task');
const DashboardVisible = require('../../screenplay/questions/dashboard.question');

let actor;

Given('el usuario está en la página de login', async function () {
  let options = new chrome.Options();
  options.addArguments('--headless=new');       // Chrome 112+ requiere esto
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-gpu');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  actor = new Actor('Juan Manuel Yepes', driver);
  global.actor = actor;
});

When('ingresa sus credenciales válidas', async function () {
  await LoginTask.performAs(actor);
});

Then('debería ver el dashboard', async function () {
  const result = await DashboardVisible.answeredBy(actor);
  assert.strictEqual(result, true);
});

// Cierra el browser al terminar cada escenario
//After(async function () {
//  if (actor && actor.driver) {
//    await actor.driver.quit();
//  }
//});