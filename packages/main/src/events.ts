import { BrowserWindow, app, dialog, ipcMain } from 'electron';

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

  ipcMain.on('minimize-window', () => {
    BrowserWindow.getAllWindows()
      .find(w => !w.isDestroyed())
      ?.minimize();
  });

  ipcMain.on('close-application', () => {
    app.quit();
  });
}
