//Ogarnąć progress bar, bo tak jest tragicznie i nie działa
export async function updateProgressBar(actionName: string, progressValue: number): Promise<void> {
  window.postMessage({actionName, progressValue});
  return Promise.resolve();
}
