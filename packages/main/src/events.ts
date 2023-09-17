import {dialog, ipcMain} from 'electron';

export function addEvents() {
  ipcMain.on('open-folder-dialog', event => {
    dialog
      .showOpenDialog({
        properties: ['openDirectory'],
      })
      .then(result => {
        if (!result.canceled) {
          const folderPath = result.filePaths[0];
          event.reply('folder-selected', folderPath);
        }
      })
      .catch(err => {
        console.error(err);
      });
  });
}
