/// <reference types="cypress" />
import { createStagehand } from "../../support/stagehand/stagehand.core";
import { z } from "zod";

describe("Login IA Stagehand", () => {
  it("debe permitir login", async () => {
    // 1. Inicializamos Stagehand correctamente
    const stagehand = await createStagehand();
    
    // Forzamos temporalmente a any para saltarnos la pelea de tipos con Cypress
    const sh = stagehand as any; 

    // 2. Navegación e instrucciones de IA
    await sh.page.goto("/login");

    await sh.page.act(`
      Inicia sesión con:
      correo: admin@example.com
      contraseña: Admin1234
    `);

    // 3. Extracción de datos usando un esquema real de Zod
    const result = await sh.page.extract({
      instruction: "¿El usuario está autenticado?",
      schema: z.object({
        logged: z.boolean()
      }),
    });

    // 4. Asertividad
    expect(result.logged).to.be.true;

    // 5. Limpieza
    await sh.close();
  });
});