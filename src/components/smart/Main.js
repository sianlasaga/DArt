import React, { Component } from 'react'
import { Container } from 'react-bootstrap/lib';

import WalletForm from '../dumb/forms/WalletForm'
import Wallet from '../../utils/wallet'

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      privateKey: '',
      password: '',
      shouldGenerateWallet: false,
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCheckBox = this.handleCheckBox.bind(this)
  }

  handleInputChange(e) {
    e.preventDefault()
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  async handleSubmit(e) {
    e.preventDefault()
    const { privateKey, password } = this.state
    console.log(privateKey)
    try {
      const wallet = new Wallet(privateKey)
      console.log(wallet)
      const encryptedWallet = await Wallet.encryptWallet(wallet.wallet, password)
      console.log(encryptedWallet)
      sessionStorage.setItem('jsonwallet', encryptedWallet)
    } catch (error) {
      console.log(error)
    }
  }

  handleCheckBox() {
    const { shouldGenerateWallet } = this.state
    this.setState({ shouldGenerateWallet: !shouldGenerateWallet })
  }
  
  render() {
    const { privateKey, password, shouldGenerateWallet } = this.state
    return (
      <Container>
				<WalletForm
          handleInputChange={this.handleInputChange}
          handleSubmit={this.handleSubmit}
          handleCheckBox={this.handleCheckBox}
					privateKey={privateKey}
					password={password}
					shouldGenerateWallet={shouldGenerateWallet}
				/>
      </Container>
    )
  }
}

export default Main
