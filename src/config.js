import ethers from 'ethers'

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545')
const networkId = '5777'
const ipfsPort = 5001

const availableCategories = ['Painting', 'Sculpture', 'Ceramics', 'Mosaic', 'Others']
const limitPerCategory = 6

export {
  provider,
  networkId,
  ipfsPort,
  availableCategories,
  limitPerCategory,
}
