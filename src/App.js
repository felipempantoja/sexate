import React, { Component } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Button from 'react-bootstrap/Button'
import Dropzone from './components/dropzone'

// Make sure to append window as babel will get confused by the require
const { ipcRenderer } = window.require('electron')

const parentContainerStyles = {
  // position: 'absolute',
  // height: '600px',
  // width: '100%',
  // display: 'table',
  // backgroundColor: '#282c34',
  // height: '200px',
  // lineHeight: '200px',
  // textAlign: 'center'
};

export default class App extends Component {

  state = {
    step: 1,
    files: [],
    recipients: []
  }

  close = _ => ipcRenderer.send('close')

  gotoStep = step => this.setState({ step })

  onDrop = (files) => {
    const recipients = files.map(e => e.name.substring(0, e.name.length-4))
    this.setState({ files, step: 2, recipients })
  }

  onChangeRecipient = (index) => this.setState()

  render() {
    return (
      <Container style={parentContainerStyles}>
        {this.state.step === 1 && <Dropzone handleDrop={this.onDrop} />}

        {this.state.step === 2 &&
          <Form>
            {this.state.files.map((file, index) =>
              <Form.Group key={index} controlId="formBasicEmail">
                <Form.Label>{file.name}</Form.Label>
                <Form.Control type="email"
                  value={this.state.recipients[index]}
                  onChange={() => this.onChangeRecipient(index)} />
              </Form.Group>
            )}
            <ButtonToolbar>
              <Button variant="success">Enviar Email(s)</Button>
              <Button variant="primary" onClick={() => this.gotoStep(1)}>Voltar</Button>
            </ButtonToolbar>
          </Form>
        }
      </Container>
    )
  }
}
