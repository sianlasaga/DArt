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
  }

  handleInputChange(e) {
    e.preventDefault()
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  
  render() {
    const { privateKey, password, shouldGenerateWallet } = this.state
    return (
      <Container>
				<WalletForm
					handleInputChange={this.handleInputChange}
					privateKey={privateKey}
					password={password}
					shouldGenerateWallet={shouldGenerateWallet}
				/>
      </Container>
    )
  }
}

export default Main
