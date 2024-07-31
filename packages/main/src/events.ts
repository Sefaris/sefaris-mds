import { BrowserWindow, app, dialog, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
export function addEvents() {
  ipcMain.handle('open-folder-dialog', async (): Promise<string> => {
  let filePath = '';
  let fileExists = false;

  while (!fileExists) {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (result.canceled) {
      return '';
    }

    const selectedPath = result.filePaths[0];
    const exeFilePath = path.join(selectedPath, 'gothic3.exe');

    if (fs.existsSync(exeFilePath)) {
      filePath = selectedPath;
      fileExists = true;
    } else {

      await dialog.showMessageBox({
        type: 'error',
        title: 'Incorrect path',
        message: 'Gothic3.exe wasnt found. Select correct directory.',
        buttons: ['OK'],
      });
    }
  }

  return filePath;
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
