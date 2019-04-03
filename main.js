// Example of Electron Prompt: https://www.scriptol.com/javascript/electron-prompt.php

const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('upload-files', (event, arg) => {
  dialog.showOpenDialog(win, { properties: ['openFile', 'multiSelections'] }, filepaths => {
    if (!filepaths) {
      dialog.showMessageBox(win, {
        type: 'warn',
        message: 'Nenhum arquivo foi selecionado.',
        buttons: ['Ok']
      })
      return
    }

    console.log(filepaths)

    filepaths.forEach(filepath => {
      dialog.showMessageBox(win, {
        type: 'question',
        buttons: ['Sim', 'Não'],
        defaultId: 0,
        title: 'Confirmação',
        message: 'Deseja realmente enviar o email para fulano?',
        detail: 'It does not really matter'
      }, response => {
        if(response === 0) { // yes

        } else { // 1 === no

        }
      })
    })


    // fs.readFile(filename[0], 'utf-8', (err, data) => {
    //   if (err) {
    //     dialog.showMessageBox(null, {
    //       type: 'error',
    //       message: 'Erro ao ler o arquivo selecionado.',
    //       buttons: ['Ok']
    //     })
    //     return
    //   }
    //   console.log('o conteudo eh: ', data)
    // })
  })
})
