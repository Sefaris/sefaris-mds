import { ipcRenderer } from 'electron';

export function minimizeWindow() {
  ipcRenderer.send('minimize-window');
}

export function closeApplication() {
  ipcRenderer.send('close-application');
}
