export class UploadcareHandler {
  constructor() {
    this.uploadedVideoUuid = null
    this.init()
  }

  init() {
    this.waitForUploadcare()
  }

  waitForUploadcare() {
    const checkUploadcare = () => {
      const ctxProvider = document.querySelector("uc-upload-ctx-provider")
      if (ctxProvider) {
        this.setupEventListeners(ctxProvider)
      } else {
        setTimeout(checkUploadcare, 100)
      }
    }
    checkUploadcare()
  }

  setupEventListeners(ctxProvider) {
    ctxProvider.addEventListener("common-upload-success", (e) => {
      console.log("Upload successful:", e.detail)
      
      if (e.detail.successEntries && e.detail.successEntries.length > 0) {
        this.uploadedVideoUuid = e.detail.successEntries[0].uuid
        console.log("Video UUID:", this.uploadedVideoUuid)
        
        // Dispatch custom event for other modules to listen
        window.dispatchEvent(new CustomEvent('videoUploaded', {
          detail: {
            uuid: this.uploadedVideoUuid,
            fileName: e.detail.successEntries[0].name
          }
        }))
      }
    })

    ctxProvider.addEventListener("common-upload-error", (e) => {
      console.error("Upload error:", e.detail)
      window.dispatchEvent(new CustomEvent('videoUploadError', {
        detail: e.detail
      }))
    })
  }

  getVideoUuid() {
    return this.uploadedVideoUuid
  }
}
