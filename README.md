## Sexate - Fast Mailer with Attachments

### Developing

- `yarn start`

### Packaging

- For Linux: `yarn release:linux`
- For Windows: `yarn release:win`
 - Important: Packaging for Windows requires [Wine](https://blog.aaronlenoir.com/2017/03/03/building-electron-apps-for-windows-on-debian) (only if you are running packaging on Linux)

### Logging
- On Linux: `~/.config/<app name>/log.log`
- On Windows: `%USERPROFILE%\AppData\Roaming\<app name>\log.log`
> For further informations, check out [electron-log documentation](https://github.com/megahertz/electron-log)

### Settings File

This file is used to guide Sexate in order to send proper emails. The template is defined as follows:
- Location: `$USER_HOME/sexate-mail-settings.json`
- Content: 
  ```json
  {
    "apiKey": "SENDGRID_API_KEY",
    "from": "FROM_NAME <FROM_EMAIL>",
    "subject": "SUBJECT_EMAIL",
    "html": "<p>WHATEVER HTML MESSAGE YOU WANT TO PUT</p>"
  }
  ```
