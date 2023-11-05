import {BrowserWindow, app, dialog, ipcMain} from 'electron';
import fs from 'fs';
import path from 'path';
export function addEvents() {
  ipcMain.handle('open-folder-dialog', async (): Promise<string> => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });
    if (!result.canceled) {
      return result.filePaths[0];
    }
    return '';
  });

  ipcMain.handle('get-app-path', async () => {
    return app.getAppPath();
  });

  ipcMain.handle('load-icon', async () => {
    const base64 = (
      await fs.promises.readFile(path.join(app.getAppPath(), 'buildResources', 'icon.png'))
    ).toString('base64');
    return `data:image/png;base64,${base64}`;
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
