import React from 'react'
import Form from 'react-bootstrap/Form'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'

const buttonStyle = {
  marginRight: '5px'
}

function RecipientsForm({ recipients, onChangeEmailRecipient, onSendEmails, onBack, sendingEmails }) {
  return (
    <Form>
      {recipients.map((recipient, index) =>
        <Form.Group key={index} controlId="formBasicEmail">
          <Form.Label>{recipient.file.name}</Form.Label>
          <Form.Control type="email"
            value={recipients[index].email}
            onChange={e => onChangeEmailRecipient(index, e.target.value)}
            disabled={sendingEmails} />
        </Form.Group>
      )}
      <ButtonToolbar>
        <Button
          style={buttonStyle}
          variant="success"
          onClick={onSendEmails}
          disabled={sendingEmails}>
          {
            sendingEmails &&
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          }
          Enviar Email(s)
        </Button>
        <Button variant="primary" onClick={onBack} disabled={sendingEmails}>Voltar</Button>
      </ButtonToolbar>
    </Form>
  )
}

export default RecipientsForm

