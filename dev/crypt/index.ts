import { getHashOfBlob } from '../../src/crypt'
import { partyFileUpload } from '../../src/upload'

const input = document.getElementById('files') as HTMLInputElement

const BLOCK_SIZE = 1024 * 5
// const BLOCK_SIZE = 5

input.addEventListener('change', (event) => {
  const files = (event.target as HTMLInputElement).files!
  for (let i = 0; i < files.length; i += 1) {
    sendFile('http://localhost:8082/upload.php?key=tmpkey', files.item(i)!)
  }
})

function onLoaded () {
  console.log('onLoaded')
}

function onProgress () {
  console.log('onProgress')
}

function onError () {
  console.log('onError')
}

async function sendFile (url: string, file: File, blockSize = BLOCK_SIZE) {
  const blockCount = Math.ceil(file.size / blockSize)
  for (let blockIndex = 0; blockIndex < blockCount; blockIndex += 1) {
    const blob = file.slice(blockIndex * blockSize, (blockIndex + 1) * blockSize)
    const fileHash = await getHashOfBlob(blob)
    await partyFileUpload({
      url,
      file: blob,
      blockIndex,
      blockCount,
      hash: fileHash,
      onLoaded: onLoaded,
      onProgress: onProgress,
      onError: onError,
    })
    console.log(fileHash)
  }
}

// async function send (i: number) {
//   for (let part = 0; part < 10; part += 1) {
//     await new Promise((resolve) => {
//       setTimeout(() => {
//         resolve()
//         // console.log('time', i)
//       }, 1000 * i)
//     })
//     console.log('while', i)
//   }
// }
//
// for (let i = 1; i <= 2; i += 1) {
//   send(i)
// }
//
// console.log('end')
