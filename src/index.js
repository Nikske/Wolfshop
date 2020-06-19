const { app, BrowserWindow, Menu, globalShortcut, ipcMain } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// Create the menu
const createMenu = () => {
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.on('ready', createMenu);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Custom menu
const menuTemplate = [
  { label: 'File',
  submenu: [
    {role: 'togglefullscreen'},
    {role: 'quit'}
  ]},
  {label: '! WILD STUFF !',
  submenu: [{
    label: 'New window',
    accelerator: 'CmdOrCtrl+N',
    click() {
      addWindow();
    },
  }]
}]

// New window
function addWindow() {
  const addWin = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    }
  });

  addWin.loadFile(path.join(__dirname, 'addWin.html'));
  addWin.webContents.openDevTools();
}

// Global keyboard shortcut
app.whenReady().then(() => {
  globalShortcut.register('CmdOrCtrl+X', () => {
    console.log("AAAAAAAAAAAAAAH");
  })
})

// IPC - Creating new window
ipcMain.on('open-new-window', (event) => {
  const win = new BrowserWindow({
    width: 400,
    height: 400
  });
  win.loadURL('https://cdn.discordapp.com/attachments/190172196365139969/687338337391869954/37p4odqylni41.png');
})

// IPC - Receiving form input
ipcMain.on('add-thing', (event, thing) => {
  mainWindow.webContents.send('add-thing', thing);
})