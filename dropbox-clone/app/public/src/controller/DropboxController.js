const doc = (el) => document.querySelector(el)
const docAll = (el) => document.querySelectorAll(el)

class DropboxController {
  constructor() {
    this.btnSendFileEl = doc('#btn-send-file')
    this.inputFileEl = doc('#files')
    this.snackModalEl = doc('#react-snackbar-root')

    this.initEvents()
  }

  initEvents(){
    this.btnSendFileEl.addEventListener('click', event => {
      this.inputFileEl.click()
    })

    this.inputFileEl.addEventListener('change', event => {

      this.uploadTask(event.target.files)

      this.snackModalEl.style.display = 'block'
    })
  }

  uploadTask(files) {
    let promises = [];

    [...files].forEach(file => {
      promises.push(new Promise((resolve, reject) => {
        const ajax = new XMLHttpRequest()

        ajax.open('POST', '/upload')

        ajax.onload = event => {
          try {
            resolve(JSON.parse(ajax.responseText))
          } catch (e) {
            reject(e)
          }
        }

        ajax.onerror = event => {
          reject(event)
        }

        const formData = new FormData()

        formData.append('input-file', file)

        ajax.send(formData)

      }))
    })

    return Promise.all(promises)
  }
}
