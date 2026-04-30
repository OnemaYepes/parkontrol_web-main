const { When, Then, After } = require('@cucumber/cucumber');
const assert = require('assert');

const LoginFailTask = require('../../screenplay/tasks/loginFailTask');
const loginError = require('../../screenplay/questions/loginError.question');

When('ingresa credenciales inválidas', async function () {
  await LoginFailTask.performAs(global.actor);
});

Then('debería ver un mensaje de error', async function () {
  const result = await loginError.answeredBy(global.actor);
  assert.strictEqual(result, true);
});