import React, { Component } from 'react'
import { Container, Jumbotron } from 'react-bootstrap/lib';

import WalletForm from '../dumb/forms/WalletForm'
import Wallet from '../../utils/wallet'

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      privateKey: '',
      password: '',
      shouldGenerateWallet: false,
      isLoggedIn: false,
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
      // this.props.history.push('/artworks')
      window.location.href = '/artworks'
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
      <Container style={{ padding: '5%' }}>
        <Jumbotron style={{ width: '65%', margin: 'auto', paddingRight: '7.5%', paddingLeft: '7.5%' }}>
          <h1 style={{ textAlign: 'center'}}>{shouldGenerateWallet ? 'Create wallet' : 'Open Wallet' }</h1>
          <WalletForm
            handleInputChange={this.handleInputChange}
            handleSubmit={this.handleSubmit}
            handleCheckBox={this.handleCheckBox}
            privateKey={privateKey}
            password={password}
            shouldGenerateWallet={shouldGenerateWallet}
          />
        </Jumbotron>
      </Container>
    )
  }
}

export default Main
