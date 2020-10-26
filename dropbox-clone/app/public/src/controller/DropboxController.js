const doc = (el) => document.querySelector(el)
const docAll = (el) => document.querySelectorAll(el)

class DropboxController {
  constructor() {
    this.btnSendFileEl = doc('#btn-send-file')
    this.inputFileEl = doc('#files')
    this.snackModalEl = doc('#react-snackbar-root')
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

      this.snackModalEl.style.display = 'block'
    })
  }

  ajax(url, method = 'GET', formData = new FormData(), onprogress = function(){}, onloadstart = function(){}){
    return new Promise((resolve,reject)=>{
      let ajax = new XMLHttpRequest()
      ajax.open(method, url);

      ajax.onload = event=>{
        try{
          resolve(JSON.parse(ajax.responseText));
        }catch(e){
          reject(e);
        }
      }
      ajax.onerror = event=>{
        reject(event);
      }
      // MOSTRA PROGRESSO DO UPLOAD
      ajax.upload.onprogress = onprogress();

      onloadstart();

      ajax.send(formData);
    });

  }

  uploadTask(files){

    let promises = [];

    [...files].forEach(file => {

      let formData = new FormData();

      formData.append('input-file', file);

      promises.push(this.ajax('/upload','POST', formData,
        ()=>{
          this.uploadProgress(event, file);
        },
        ()=>{
          this.startUploadTime = Date.now();
        }));
      });

    return Promise.all(promises)
  }

  uploadProgress(event, file){
    let timePent = Date.now() - this.startUploadTime;
    let loaded = event.loaded;
    let total = event.total;

    let percentage = ((loaded / total) * 100);
    let timeLeft =(100 - percentage) * timePent / percentage;

    console.log(timePent)

    this.progressBarEl.style.width = `${percentage}%`;
    this.nameFileEl.innerHTML = file.name;
    this.timeLeftEl.innerHTML = this.formatTimeUploadProgress(timeLeft);
  }

  formatTimeUploadProgress(duration){
    let seconds = parseInt((duration/1000) % 60);
    let minutes= parseInt((duration / (1000*60)) % 60);
    let hours = parseInt((duration / (1000* 60 * 60)) % 24);

    if(hours > 0) {
      return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
    }
    if(minutes > 0) {
      return `${minutes} minutos e ${seconds} segundos`;
    }
    if(seconds > 0) {
      return `${seconds} segundos`;
    }
    else{
      return 'aguarde...'
    }

  }
}
