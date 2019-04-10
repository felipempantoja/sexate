const electron = require("electron");
const { app, BrowserWindow, ipcMain } = electron;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600, resizable: false });
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", _ => mainWindow = null);

    // Open the DevTools.
    mainWindow.webContents.openDevTools()


}

app.on("ready", createWindow);

app.on("window-all-closed", _ => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", _ => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('close', _ => mainWindow.close())

ipcMain.on('minimize', _ => mainWindow.minimize())

ipcMain.on('maximize', _ => mainWindow.maximize())

ipcMain.on('unmaximize', _ => mainWindow.unmaximize())
