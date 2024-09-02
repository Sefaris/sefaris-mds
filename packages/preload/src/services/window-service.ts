import { ipcRenderer } from 'electron';

export function openConfigWindow() {
  ipcRenderer.send('open-config-window');
}

export function changeConfigLocale(code: string) {
  ipcRenderer.send('change-config-locale', code);
}

ipcRenderer.on('update-config-locale', (_, code) => {
  // TODO: use ports instead of postmessage
  window.postMessage(code);
});
