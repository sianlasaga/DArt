import ethers from 'ethers'

import { provider, networkId } from '../config'
const Auction =  require('../contracts/Auction.json')
const ArtworkBase = require('../contracts/ArtworkBase.json')
const ArtworkOwnership = require('../contracts/ArtworkOwnership.json')

class Contract {

  constructor(type, privateKey) {
    const { abi, address } = this.getAbiAndContractAddress(type)
    console.log(address)
    let wallet = null
    if (privateKey) {
      wallet = new ethers.Wallet(privateKey, provider)
    }
    console.log(wallet)
    this.contract = (wallet) ? new ethers.Contract(address, abi, wallet)
      : new ethers.Contract(address, abi, provider)
  }

  // static async loadContract(type) {
  //   const { abi, address } = this.getAbiAndContractAddress(type)
  //   return new ethers.Contract(address, abi, provider)
  // }

  // static async loadContractWithWallet(type, wallet) {
  //   const { abi, address } = this.getAbiAndContractAddress(type)
  //   return new ethers.Contract(address, abi, wallet)
  // }

  getContractJson(type) {
    if (type === 'Auction') return Auction
    else if (type === 'ArtworkBase') return ArtworkBase
    else if (type === 'ArtworkOwnership') return ArtworkOwnership
  }

  getAbiAndContractAddress(type) {
    const contractJson = this.getContractJson(type)
    return {
      abi: contractJson.abi,
      address: contractJson.networks[networkId].address,
    }
  }
  
}

export default Contract

