import { ICryptResult } from '@wumvi/fileupload/type'

interface ICallback {
  onLoaded: (status: string, code: number, xhr: XMLHttpRequest) => void
  onProgress: (loaded: number, total: number, xhr: XMLHttpRequest) => void
  onError: (status: string, code: number, xhr: XMLHttpRequest) => void
}

interface IUpload extends ICallback {
  url: string
  file: File | Blob
  hash: ICryptResult
  blockIndex: number
  blockCount: number
}

export function partyFileUpload (data: IUpload, xhr = new XMLHttpRequest()) {
  return new Promise((resolve, reject) => {
    xhr.addEventListener('load', () => {
      data.onLoaded(xhr.statusText, xhr.status, xhr)
      resolve()
    })
    xhr.addEventListener('error', () => {
      data.onError(xhr.statusText, xhr.status, xhr)
      reject()
    })
    xhr.addEventListener(
      'progress',
      (event: ProgressEvent) => data.onProgress(event.loaded, event.total, xhr)
    )

    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('algorithm', data.hash.algorithm)
    formData.append('hash', data.hash.hash)
    formData.append('block', data.blockIndex + '')
    formData.append('count', data.blockCount + '')
    xhr.open('POST', data.url, true)
    xhr.send(formData)
  })
}
