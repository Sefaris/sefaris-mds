import { BrowserWindow, app, dialog, ipcMain } from 'electron';
import { translate } from '../../../plugins/i18n';
import * as path from 'path';
import * as fs from 'fs';

export function addEvents() {
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
    BrowserWindow.getAllWindows()
      .find(w => !w.isDestroyed())
      ?.minimize();
  });

  ipcMain.on('close-application', () => {
    app.quit();
  });
}
