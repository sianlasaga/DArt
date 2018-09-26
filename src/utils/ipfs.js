import ipfsAPI from 'ipfs-api'
import { ipfsPort } from '../config';

const IPFS = ipfsAPI('localhost', ipfsPort, { protocol: 'http' })

const upload = (file, callback) => {
  const fileReader = new FileReader()
  fileReader.onload = () => {
    const fileBuffer = Buffer.from(fileReader.result)
    IPFS.files.add(fileBuffer, callback)
  }
  fileReader.readAsArrayBuffer(file)
}

export {
  upload,
}
