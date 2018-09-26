import ethers from 'ethers'

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545')
const networkId = '5777'

export {
  provider,
  networkId
}
