export function updateProgressBar(actionName: string, step: number, maxSteps: number) {
  window.postMessage({ actionName, step, maxSteps });
}
