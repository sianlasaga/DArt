import ethers from 'ethers'

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545')

export {
  provider
}
