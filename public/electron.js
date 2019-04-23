const electron = require("electron")
const { app, BrowserWindow, ipcMain, dialog } = electron
const log = require('electron-log')
const fs = require('fs')
const path = require("path")
const isDev = require("electron-is-dev")
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

// Log Configs
// log.transports.console.level = isDev
// log.transports.file.level = !isDev

let mainWindow
let mailSettings

function createWindow() {
  log.info('-----------------------------------------------------')
  log.info('Preparing to initialize Sexate...')
  const homedir = require('os').homedir()
  const settingsPath = path.join(homedir, 'sexate-mail-settings.json')
  try {
    log.info(`Checking the existence of the settings file: ${settingsPath}`)
    mailSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
    log.info(mailSettings.html)

    log.info('Creating a BrowserWindow instance...')
    mainWindow = new BrowserWindow({ width: 800, height: 600, resizable: false })
    mainWindow.setMenuBarVisibility(false)
    mainWindow.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    )
    mainWindow.on("closed", _ => mainWindow = null)

    // Open the DevTools.
    if(isDev) {
      mainWindow.webContents.openDevTools()
    }

  } catch (err) {
    log.error('Error while starting the app', err)
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
      log.info(`Chosen files to send emails: ${files}`)
      mainWindow.webContents.send('chosen-files', files.map(file => ({
        name: file.substring(file.lastIndexOf(path.sep) + 1, file.length),
        path: file
      })))
    }
  });
})

ipcMain.on('sendmail', async (event, recipients) => {
  log.info('Preparing to send emails...')
  // Configure Nodemailer SendGrid Transporter
  const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: mailSettings.apiKey
      },
    })
  )

  let failedEmails = []

  for (let recipient of recipients) {
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
    try {
      log.info(`Sending email to "${recipient.email}" with attachment "${recipient.file.name}"`)
      await transporter.sendMail(mailOptions)
      log.info(`Email to "${recipient.email}" successfully sent`)
    } catch (err) {
      log.info(`Error sending email to "${recipient.email}"`, err)
      failedEmails.push(recipient.email)
    }
  }

  if (failedEmails.length) {
    log.info(`Total failed mail sendings: ${failedEmails.length}`)
    mainWindow.webContents.send('error-sending-emails', failedEmails)
  } else {
    log.info('All emails has been sent')
    mainWindow.webContents.send('emails-sent')
  }
})
