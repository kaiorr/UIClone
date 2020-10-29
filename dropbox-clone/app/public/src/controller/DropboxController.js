class DropboxController {
  constructor() {
    this.btnSendFileEl = document.querySelector('#btn-send-file')
    this.inputFileEl = document.querySelector('#files')
    this.snackModalEl = document.querySelector('#react-snackbar-root')
    this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg')
    this.nameFileEl = this.snackModalEl.querySelector('.filename')
    this.timeLeftEl = this.snackModalEl.querySelector('.timeleft')

    this.initEvents()
  }

  initEvents(){
    this.btnSendFileEl.addEventListener('click', event => {
      this.inputFileEl.click()
    })

    this.inputFileEl.addEventListener('change', event => {

      this.uploadTask(event.target.files)

      this.modalShow()

      this.inputFileEl.value = '';
    })
  }

  modalShow(show = true) {
    this.snackModalEl.style.display = (show) ? 'block' : 'none'
  }

  uploadTask(files){

    let promises = [];

    [...files].forEach(file => {

      promises.push(new Promise((resolve, reject) => {

        const ajax = new XMLHttpRequest();

        ajax.open('POST', '/upload')

        ajax.onload = event => {

          this.modalShow(false)

          try {
            resolve(JSON.parse(ajax.responseText))
          } catch (err) {
            reject(err)
          }
        }

        ajax.onerror = event => {

          this.modalShow(false)

          reject(err)
        }

        ajax.upload.onprogress = event => {
          this.uploadProgress(event, file)
        }

        const formDate = new FormData()

        formDate.append('input-file', file)

        this.startUploadTime = Date.now()

        ajax.send(formDate)

      }))
    });

    return Promise.all(promises)
  }

  uploadProgress(event, file){
    let timePent = Date.now() - this.startUploadTime
    let loaded = event.loaded
    let total = event.total

    let percentage = ((loaded / total) * 100)
    let timeLeft = parseInt((100 - percentage) * timePent / percentage)

    this.progressBarEl.style.width = `${percentage}%`
    this.nameFileEl.innerHTML = file.name
    this.timeLeftEl.innerHTML = this.formatTimeUploadProgress(timeLeft)
  }

    formatTimeUploadProgress(duration){
    let seconds = parseInt((duration/1000) % 60)
    let minutes= parseInt((duration / (1000*60)) % 60)
    let hours = parseInt((duration / (1000* 60 * 60)) % 24)

    if(hours > 0) {
      return `${hours} horas, ${minutes} minutos e ${seconds} segundos`
    }
    if(minutes > 0) {
      return `${minutes} minutos e ${seconds} segundos`
    }
    if(seconds > 0) {
      return `${seconds} segundos`
    }
    else{
      return 'finalizado'
    }

  }
}
