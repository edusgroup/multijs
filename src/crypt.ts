import { ICryptResult } from '@wumvi/fileupload/type'

const crcTable: number[] = []

function makeCRCTable (crcTable: number[]) {
  let c
  for (let n = 0; n < 256; n++) {
    c = n
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1))
    }
    crcTable[n] = c
  }
}

function lazeMakeCRCTable () {
  if (crcTable.length === 0) {
    makeCRCTable(crcTable)
  }
}

function getCrcOfArrayBuffer (buffer: ArrayBuffer) {
  lazeMakeCRCTable()
  let dataView = new DataView(buffer, 0)
  const len = dataView.byteLength
  let crc = 0 ^ (-1)
  for (let i = 0; i < len; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ dataView.getUint8(i)) & 0xFF]
  }
  return (crc ^ (-1)) >>> 0
}

function buf2hex (buffer: ArrayBuffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
}

function isCryptoApiSupport () {
  return window.crypto !== undefined && window.crypto.subtle !== undefined
}

/**
 * Возвращает контрольную сумму по ArrayBuffer
 *
 * @param buffer
 * @param preferAlgorithm
 */
async function getHash (buffer: ArrayBuffer, preferAlgorithm: string | null = null): Promise<ICryptResult> {
  const algorithm = 'SHA-1'
  if (isCryptoApiSupport() && (preferAlgorithm === null || preferAlgorithm === algorithm)) {
    return {
      algorithm,
      hash: buf2hex(await crypto.subtle.digest({ name: algorithm }, buffer))
    }
  }

  return {
    algorithm: 'CRC32',
    hash: getCrcOfArrayBuffer(buffer).toString(16)
  }
}

/**
 * Возвращает контрольную сумму по файлу или по его части
 *
 * @param file
 */
function getHashOfBlob (file: File | Blob): Promise<ICryptResult> {
  return new Promise((resolve => {
    const reader = new FileReader()
    reader.onload = () => {
      getHash(reader.result as ArrayBuffer).then(resolve)
    }

    reader.readAsArrayBuffer(file)
  }))
}

export { getHashOfBlob }
