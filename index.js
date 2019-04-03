const { ipcRenderer } = require('electron')

let totalFiles = 0

document.getElementById('btn-upload-file').addEventListener('click', _ => {
  ipcRenderer.send('upload-files')
}, false)

var holder = document.getElementById('drag-file')

holder.ondragover = () => false

holder.ondragleave = () => false

holder.ondragend = () => false

holder.ondrop = (e) => {
  e.preventDefault()

  let chosenFiles
  totalFiles = e.dataTransfer.files.length

  let index = 0
  for(let file of e.dataTransfer.files) {
    console.log('File(s) you dragged here: ', file.path)
    chosenFiles += `
    <input type="hidden" id="path_${index}" value="${file.path}">
    <h3><input type="text" id="file_${index}" value="${file.name}"></h3>
    `
    index++
  }
  const chosenFilesContainer = document.getElementById('chosen-files')
  chosenFilesContainer.innerHTML = chosenFiles

  if(totalFiles > 0) {
    document.getElementById('btn-confirm-upload').style.display = 'block'
  }
  return false
}

document.getElementById('btn-confirm-upload').addEventListener('click', _ => {
  for(let index = 0; index < totalFiles; index++) {
    console.log(`arquivo ${index}: ${document.getElementById(`file_${index}`).value}`)
  }
  // ipcRenderer.send('upload-files')
}, false)
