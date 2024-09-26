import { ipcRenderer } from 'electron';
import type { AlertType } from '../../../../types/AlertType';
export function showAlert(title: string, message: string, type?: AlertType) {
  window.postMessage({
    channel: 'show-alert-modal',
    alert: { title: title, message: message, type: type },
  });
}

export function showNotification(notification: {
  window: 'main' | 'cofig';
  title: string;
  body: string;
}) {
  ipcRenderer.send('show-notification', notification);
}
