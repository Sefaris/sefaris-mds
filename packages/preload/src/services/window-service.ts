import { ipcRenderer } from 'electron';

export function openConfigWindow() {
  ipcRenderer.send('open-config-window');
}
