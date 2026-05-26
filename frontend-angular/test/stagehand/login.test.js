import { Stagehand } from "@browserbasehq/stagehand";
import dotenv from "dotenv";

dotenv.config();

async function main() {

  console.log("🤖 Inicializando Stagehand con OpenAI...");

  const stagehand = new Stagehand({
    env: "LOCAL",

    model: "openai/gpt-4.1-mini",

    verbose: 1,

    headless: false,
  });

  try {

    await stagehand.init();

    console.log("✅ Navegador iniciado");

    const page =
      stagehand.page ||
      await stagehand.context.newPage();

    await page.goto("http://localhost:4200/login");

    console.log("✍️ Ejecutando IA...");

    await page.act(
      "Escribe juan@gmail.com en el campo de correo"
    );

    await page.act(
      "Escribe Prueba123456 en el campo de contraseña"
    );

    await page.act(
      "Haz click en el botón iniciar sesión"
    );

    await page.waitForTimeout(3000);

    const result = await page.observe(
      "Verifica si el login fue exitoso"
    );

    console.log("📄 Resultado:");
    console.log(result);

  } catch (err) {

    console.error("❌ Error:", err);

  } finally {

    console.log("🔌 Cerrando navegador...");

    await stagehand.close();
  }
}

main();