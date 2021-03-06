import ethers from 'ethers'

import { provider } from '../config'

class Wallet {

  constructor(privateKey) {
    this.wallet = privateKey ? new ethers.Wallet(privateKey) : new ethers.Wallet.createRandom()
  }

  static generateNewWallet(password, progressCallback) {
    const wallet = ethers.Wallet.createRandom()
    return this.encryptWallet(wallet, password, progressCallback)
  }

  static encryptWallet(wallet, password, progressCallback) {
    return wallet.encrypt(password, {}, progressCallback)
  }

  static decryptWallet(json, password, progressCallback) {
    return ethers.Wallet.fromEncryptedWallet(json, password, progressCallback)
  }
}

export default Wallet
