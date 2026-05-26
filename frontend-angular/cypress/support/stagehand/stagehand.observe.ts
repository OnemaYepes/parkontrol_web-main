import { Stagehand } from "@browserbasehq/stagehand";

export async function observe(page: Stagehand, instruction: string) {
  return page.observe(instruction);
}