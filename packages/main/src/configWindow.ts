import { BrowserWindow, app } from 'electron';
import * as path from 'path';
import { getWindows } from './mainWindow';

export async function createConfigWindow() {
  const windows = getWindows();
  if (windows['config']) {
    windows['config'].restore();
    windows['config'].focus();
    return;
  }

  const newWindow = new BrowserWindow({
    width: 800,
    height: 760,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(app.getAppPath(), 'packages/preload/dist/index.cjs'),
    },
    autoHideMenuBar: true,
  });
  newWindow.on('ready-to-show', () => {
    newWindow?.show();
    if (import.meta.env.DEV) {
      newWindow?.webContents.openDevTools();
    }
  });

  if (import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined) {
    // Ładowanie URL z serwera deweloperskiego
    await newWindow.loadURL(`${import.meta.env.VITE_DEV_SERVER_URL}#/option-list`);
  } else {
    await newWindow.loadFile(path.resolve(__dirname, '../../renderer/dist/index.html'), {
      hash: '/config',
    });
  }
  windows['config'] = newWindow;

  return newWindow;
}
