const { Given, Then, After } = require('@cucumber/cucumber');
const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const { setDefaultTimeout } = require('@cucumber/cucumber');

require('chromedriver');
setDefaultTimeout(60000);

const Actor = require('../../screenplay/actor');
const LoginTask = require('../../screenplay/tasks/login.task');

const VISTAS_URL = 'http://127.0.0.1:4200/vistas';

let actor;

Given('el usuario ha iniciado sesión y está en la página de vistas', async function () {
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
  await actor.driver.get(VISTAS_URL);

  // Espera a que desaparezca el spinner
  await actor.driver.wait(async () => {
    const spinners = await actor.driver.findElements(By.css('mat-spinner'));
    return spinners.length === 0;
  }, 15000, 'El spinner de carga no desapareció');
});

Then('debería estar en la página de vistas', async function () {
  // Verifica URL
  const url = await actor.driver.getCurrentUrl();
  assert.ok(
    url.includes('/vistas'),
    `Se esperaba estar en /vistas pero la URL es: ${url}`
  );

  // Verifica contenedor principal
  const contenedor = await actor.driver.findElements(By.css('.vistas-container'));
  assert.ok(contenedor.length > 0, 'El contenedor de vistas no está en la página');

  // Verifica las 4 tarjetas de estadísticas
  const tarjetas = await actor.driver.findElements(By.css('.estadistica-card'));
  assert.strictEqual(tarjetas.length, 4, `Se esperaban 4 tarjetas de estadísticas, se encontraron: ${tarjetas.length}`);

  // Verifica las 4 tabs
  const tabs = await actor.driver.findElements(By.css('.mat-mdc-tab'));
  const textosTabs = await Promise.all(tabs.map(t => t.getText()));
  const tabsEsperadas = ['Ocupación de Parqueaderos', 'Historial de Reservas', 'Ingresos Mensuales', 'Facturacion Completa'];

  tabsEsperadas.forEach(tabEsperada => {
    assert.ok(
      textosTabs.some(t => t.includes(tabEsperada)),
      `No se encontró la tab "${tabEsperada}". Tabs encontradas: ${textosTabs.join(', ')}`
    );
  });
});

After(async function () {
  if (actor && actor.driver) {
    await actor.driver.quit();
  }
});