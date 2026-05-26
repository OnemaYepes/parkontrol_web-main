
export async function runFlow(sh: any, steps: string[]) {
  for (const step of steps) {
    await sh.page.act(step);
  }
}