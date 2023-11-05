import {ipcRenderer} from 'electron';

export async function loadIcon(): Promise<string> {
  return await ipcRenderer.invoke('load-icon');
}
export function minimizeWindow() {
  ipcRenderer.send('minimize-window');
}

export function closeApplication() {
  ipcRenderer.send('close-application');
}
