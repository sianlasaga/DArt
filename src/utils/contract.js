import ethers from 'ethers'

import { provider, networkId } from '../config'
const Auction =  require('../contracts/Auction.json')
const ArtworkBase = require('../contracts/ArtworkBase.json')
const ArtworkOwnership = require('../contracts/ArtworkOwnership.json')

const getContractJson = (type) => {
  if (type === 'Auction') return Auction
  else if (type === 'ArtworkBase') return ArtworkBase
  else if (type === 'ArtworkOwnership') return ArtworkOwnership
}

const getAbiAndContractAddress = (type) => {
  const contractJson = getContractJson(type)
  return {
    abi: contractJson.abi,
    address: contractJson.networks[networkId].address,
  }
}

const ContractUtil = {
  loadContract: (type, privateKey) => {
    const { abi, address } = getAbiAndContractAddress(type)
    let wallet = null
    if (privateKey) {
      wallet = new ethers.Wallet(privateKey, provider)
    }
    return wallet ? new ethers.Contract(address, abi, wallet)
    : new ethers.Contract(address, abi, provider)
  },
  loadAuctionByAddress: (address, privateKey) => {
    const { abi } = Auction
    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey, provider)
      return new ethers.Contract(address, abi, wallet)
    }
    return new ethers.Contract(address, abi, provider)
  }
}

export default ContractUtil

