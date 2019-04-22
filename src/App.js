import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Dropzone from './components/dropzone'
import RecipientsForm from './components/recipients'
import MessageBox from './components/ui/MessageBox';

// Make sure to append window as babel will get confused by the require
const { ipcRenderer } = window.require('electron')

const containerStyle = {
  marginTop: '40px'
}

const headerStyle = {
  textAlign: 'center'
}

export default class App extends Component {

  state = {
    step: 1,
    files: [],
    recipients: [],
    modal: {
      show: false
    },
    sendingEmails: false
  }

  componentDidMount() {
    ipcRenderer.on('chosen-files', (event, files) => this._toRecipients(files))

    ipcRenderer.on('error-sending-emails', _ => {
      this.setState({
        sendingEmails: false,
        modal: {
          show: true,
          title: 'Erro ao enviar emails!',
          body: 'Verifique se os emails enviados são emails válidos.'
        }
      })
    })

    ipcRenderer.on('emails-sent', _ => {
      this.setState({
        step: 1,
        sendingEmails: false,
        modal: {
          show: true,
          title: 'Emails enviados com sucesso!',
          body: 'Você pode voltar e enviar novos emails.'
        }
      })
    })
  }

  handleOnBack = _ => this.setState({ step: 1 })

  handleCloseModal = _ => this.setState({ modal: { show: false } })

  handleDropFiles = e => {
    e.preventDefault()
    debugger
    const files = e.target.files || e.dataTransfer.files
    this._toRecipients(files)
  }

  handleChooseFiles = e => {
    e.preventDefault()
    ipcRenderer.send('choose-files')
  }

  _toRecipients(files) {
    let recipients = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      recipients.push({
        file: {
          name: file.name,
          path: file.path
        },
        email: file.name.substring(0, file.name.length - 4),
      })
    }
    this.setState({ recipients, step: 2 })
  }

  handleChangeEmailRecipient = (index, email) => {
    this.setState(state => {
      let recipients = state.recipients
      recipients[index].email = email
      return recipients
    })
  }

  handleSendEmails = _ => {
    this.setState({ sendingEmails: true })
    ipcRenderer.send('sendmail', this.state.recipients)
  }

  render() {
    return (
      <Container style={containerStyle}>
        <div style={headerStyle}>
          <h2>Bem vindo ao Sexate</h2>
          <h4>Serviço de envio de emails para membros</h4>
        </div>

        <hr />

        {
          this.state.step === 1 &&
          <Dropzone
            handleDrop={this.handleDropFiles}
            handleClick={this.handleChooseFiles} />
        }

        {
          this.state.step === 2 &&
          <RecipientsForm
            recipients={this.state.recipients}
            onChangeEmailRecipient={this.handleChangeEmailRecipient}
            onSendEmails={this.handleSendEmails}
            onBack={this.handleOnBack}
            sendingEmails={this.state.sendingEmails} />
        }

        <MessageBox
          show={this.state.modal.show}
          handleClose={this.handleCloseModal}
          title={this.state.modal.title}
          body={this.state.modal.body}
          sendingEmails={this.state.sendingEmails} />
      </Container>
    )
  }
}
