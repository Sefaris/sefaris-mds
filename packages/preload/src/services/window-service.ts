import { ipcRenderer } from 'electron';

export function openConfigWindow() {
  ipcRenderer.send('open-config-window');
}

export function changeConfigLocale(code: string) {
  ipcRenderer.send('change-config-locale', code);
}

ipcRenderer.on('update-config-locale', (_, code) => {
  window.postMessage({ channel: 'update-config', code: code });
});

export function forceReloadConfig() {
  ipcRenderer.send('change-config');
}

ipcRenderer.on('reload-config', () => {
  window.postMessage({ channel: 'reload-configuration' });
});
