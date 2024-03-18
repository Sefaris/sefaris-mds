//Ogarnąć progress bar, bo tak jest tragicznie ale działa
export function updateProgressBar(actionName: string, step: number, maxSteps: number) {
  window.postMessage({actionName, step, maxSteps});
}
