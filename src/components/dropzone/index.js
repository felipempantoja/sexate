import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const styles = {
  // padding: '50px',
  fontSize: '30px',
  // width: '100%',
  // height: '600px',
  // display: 'block',
  // marginLeft: 'auto',
  // marginRight: 'auto',
  // marginTop: 'auto',
  // marginBottom: 'auto',
  // position: 'absolute',
  // margin: '-15% 0 0 -25%',
  // top: '50%',
  // left: '50%',
  // textAlign: 'center',
  // height: '90px',
  // lineHeight: 'normal',
  // textAlign: 'center',
  color: 'gray',
  // display: 'inline-block',
  // verticalAlign: 'middle'
}

export default function Dropzone({ handleDrop }) {
  const onDrop = useCallback(acceptedFiles => {
    handleDrop(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf'
  })

  return (
    <div {...getRootProps()} style={styles}>
      <input {...getInputProps()} />
      {
        isDragActive
          ? <p>Solte os arquivos aqui...</p>
          : <p>Arraste e solte os arquivos PDF aqui ou clique para selecioná-los.</p>
      }
    </div>
  )
}
