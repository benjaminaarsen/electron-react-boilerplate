import os from 'os';
import { BrowserWindow, dialog, ipcMain, webContents } from 'electron';
import { DbcData } from 'dbc-can/lib/dbc/Dbc';
import parseDbcFile from '../../util/dbcParser';
import {} from 'dbc-can';

let dbcData: DbcData | null = null;

export module openDbcFile {
  ipcMain.on('open-dbc-file', async () => {
    const filePath = await dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'DBC Files', extensions: ['dbc'] },
          { name: 'All Files', extensions: ['*'] },
        ],
        defaultPath: os.homedir(),
      })
      .then((result) => {
        if (result.canceled) {
          return null;
        }
        return result.filePaths[0];
      });
    if (filePath) {
      try {
        const result = await parseDbcFile(filePath);
        dbcData = result;
        BrowserWindow.fromWebContents(
          webContents.getFocusedWebContents()!,
        )?.webContents.send('dbc-file-loaded');
      } catch (error) {
        dialog.showErrorBox('Error', error.message);
      }
    }
    return null;
  });
}

export module getDbcData {
  ipcMain.handle('get-dbc-data', () => {
    return dbcData;
  });
}
