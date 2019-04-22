import React from 'react'
import Jumbotron from 'react-bootstrap/Jumbotron'

const styles = {
  fontSize: '30px',
  color: '#676464',
  textAlign: 'center',
  border: 'dashed 1px #81868c',
  cursor: 'pointer'
}

export default function Dropzone({ handleDrop, handleClick }) {
  return (
    <Jumbotron style={styles} onDrop={handleDrop} onClick={handleClick}>
      <p>Clique para selecionar os arquivos PDF</p>
    </Jumbotron>
  )
}
