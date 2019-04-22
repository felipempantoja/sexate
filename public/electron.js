const electron = require("electron")
const { app, BrowserWindow, ipcMain, dialog } = electron
const path = require("path")
const isDev = require("electron-is-dev")
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

let mainWindow

let mailSettings

function createWindow() {
  const homedir = require('os').homedir()
  const settingsPath = `${homedir}/sexate-mail-settings.json`
  try {
    mailSettings = require(settingsPath)
  } catch (err) {
    const options = {
      type: 'error',
      buttons: ['Fechar'],
      defaultId: 1,
      title: 'Falha na Execução',
      message: 'O arquivo de configuração não foi encontrado',
      detail: `Por favor, inclua o arquivo ${settingsPath} com informações para o envio do email e reabra o Sexate`
    }
    dialog.showMessageBox(null, options, _ => app.quit())
  }

  mainWindow = new BrowserWindow({ width: 800, height: 600, resizable: false })
  mainWindow.setMenuBarVisibility(false)
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  )
  mainWindow.on("closed", _ => mainWindow = null)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

app.on("ready", createWindow)

app.on("window-all-closed", _ => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", _ => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('close', _ => mainWindow.close())

ipcMain.on('minimize', _ => mainWindow.minimize())

ipcMain.on('maximize', _ => mainWindow.maximize())

ipcMain.on('unmaximize', _ => mainWindow.unmaximize())

ipcMain.on('choose-files', _ => {
  dialog.showOpenDialog({
    filters: [
      { name: 'Documentos PDF', extensions: ['pdf'] }
    ],
    properties: ['openFile', 'multiSelections']
  }, function (files) {
    if (files !== undefined) {
      mainWindow.webContents.send('chosen-files', files.map(file => ({
        name: file.substring(file.lastIndexOf("/") + 1, file.length),
        path: file
      })))
    }
  });
})

ipcMain.on('sendmail', (event, recipients) => {
  // Configure Nodemailer SendGrid Transporter
  const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: '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'
      },
    })
  )

  recipients.forEach(recipient => {
    let mailOptions = {
      ...mailSettings,
      to: recipient.email,
      attachments: [{
        filename: recipient.file.name,
        contentType: 'application/pdf',
        path: recipient.file.path
      }]
    }
    // Send Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error)
        mainWindow.webContents.send('error-sending-emails', error)
      } else {
        mainWindow.webContents.send('emails-sent', error)
      }
    })
  })
})
