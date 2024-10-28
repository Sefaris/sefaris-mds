export function updateProgressBar(actionName: string, step: number, maxSteps: number) {
  window.postMessage({ channel: 'update-progress', progress: { actionName, step, maxSteps } });
}
