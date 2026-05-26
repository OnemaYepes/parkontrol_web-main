import { Stagehand } from "@browserbasehq/stagehand";

export async function act(page: Stagehand, instruction: string) {
  return page.act(instruction);
}