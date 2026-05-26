import { Stagehand } from "@browserbasehq/stagehand";

export async function createStagehand() {
  return new Stagehand({
    env: "LOCAL",
    // Remueve headless de aquí si te sigue chillando
  });
}