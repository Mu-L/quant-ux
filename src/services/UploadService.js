import Logger from 'common/Logger'
import AbstractService from './AbstractService'

class UploadService extends AbstractService {

  constructor () {
    super()
    this.logger = new Logger('UploadService')
  }

  delete (model, image) {
    return this._delete("/rest/uploads/" + model.id + "/" + image.id + "/" + image.url)
  }

  findUploads(id) {
    return this._get(`/rest/uploads/${id}.json`)
  }

  upload (url, formData, progressHandler) {
    this.logger.log(-1, "upload", "enter");
    return new Promise((resolve, reject) => {
        // now post a new XHR request
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      if (progressHandler) {
        xhr.onprogress = progressHandler
      }

      if (this.token) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
      } else {
        this.logger.error("_sendSingleFile", "No token");
        this.logger.sendError(new Error('Could not upload because no token'))
      }
      xhr.onload = function () {
          if (xhr.status === 200) {
            resolve(this.response);
          } else {
            this.logger.sendError(new Error('Could not upload'))
            reject(this.response);
          }
      };
      xhr.send(formData);
    })
  }
}



export default new UploadService()