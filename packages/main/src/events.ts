import { BrowserWindow, app, dialog, ipcMain } from 'electron';
import { translate } from '../../../plugins/i18n';
import * as path from 'path';
import * as fs from 'fs';
import { createConfigWindow } from './configWindow';
import { getWindows } from './mainWindow';

export function addEvents() {
  const windows = getWindows();
  ipcMain.handle('open-folder-dialog', async (): Promise<string> => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });
      if (result.canceled) {
        return '';
      }
      const selectedPath = result.filePaths[0];
      const exeFilePath = path.join(selectedPath, 'gothic3.exe');

      if (fs.existsSync(exeFilePath)) {
        return selectedPath;
      }
      await dialog.showMessageBox({
        type: 'error',
        title: 'Incorrect path',
        message: `${translate('alert.wrongPath')}`,
        buttons: ['OK'],
      });
    }
  });

  ipcMain.handle('get-app-path', async () => {
    return app.getAppPath();
  });

  ipcMain.on('minimize-window', () => {
    BrowserWindow.getFocusedWindow()?.minimize();
  });

  ipcMain.on('close-application', () => {
    if (BrowserWindow.getFocusedWindow() == windows['main']) {
      app.exit();
      return;
    } else if (BrowserWindow.getFocusedWindow() == windows['config']) {
      windows['config'].close();
      windows['config'] = undefined;
    }
  });

  ipcMain.on('open-config-window', async () => {
    createConfigWindow();
  });

  ipcMain.on('change-config-locale', (_, code) => {
    windows['config']?.webContents.send('update-config-locale', code);
  });
}
