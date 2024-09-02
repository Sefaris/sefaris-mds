export function updateProgressBar(actionName: string, step: number, maxSteps: number) {
  // TODO: use ports instead of postmessage
  window.postMessage({ actionName, step, maxSteps });
}
