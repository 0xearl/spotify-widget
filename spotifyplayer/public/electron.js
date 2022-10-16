const path = require('path');

const { app, BrowserWindow, session, contextBridge } = require('electron');
const isDev = require('electron-is-dev');
// const reactDevToolsPath = 'C:\\Users\\earls\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Extensions\\fmkadmapgofadopljbjfkapdkoienihi\\4.25.0_0';

//C:\Users\earls\AppData\Local\BraveSoftware\Brave-Browser\User Data\Default\Extensions\fmkadmapgofadopljbjfkapdkoienihi

let win


function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400,
    height: 550,
    webPreferences: {
      nodeIntegration: false,
    },
    frame: false,
    resizable: false,
    transparent: true,
  });


  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  // if (isDev) {
  //   win.webContents.openDevTools({ mode: 'detach' });
  // }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // await session.defaultSession.loadExtension(reactDevToolsPath)
  createWindow()
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
