import { ipcRenderer } from 'electron';
import type { AlertType } from '../../../../types/AlertType';
export function showAlert(
  title: string,
  message: string,
  type?: AlertType,
  showLogButton?: boolean,
  openFolderPath?: string,
) {
  window.postMessage({
    channel: 'show-alert-modal',
    alert: { title, message, type, showLogButton, openFolderPath },
  });
}

export function showNotification(notification: { title: string; body: string }) {
  ipcRenderer.send('show-notification', notification);
}
