import React, { Component } from 'react'
import { Container, Button } from 'react-bootstrap/lib'

import ContractUtil from '../../utils/contract'
import Wallet from '../../utils/wallet'
import GalleryForm from '../dumb/forms/GalleryForm'
import WalletModal from '../dumb/WalletModal'

class AddGallery extends Component {

	constructor(props) {
		super(props)
		this.state = {
			name: '',
			address: '',
			location: '',
			password: '',
			showWallet: false,
		}
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleShow = this.handleShow.bind(this)
		this.handleHide = this.handleHide.bind(this)
	}

	handleInputChange(e) {
		e.preventDefault()
		const { name, value } = e.target
		this.setState({ [name]: value })
	}

	handleShow() {
		this.setState({ showWallet: true })
	}

	handleHide() {
		this.setState({ showWallet: false })
	}

	async handleSubmit(e) {
		e.preventDefault()
		const { name, address, location, password } = this.state
		try {
			const jsonwallet = sessionStorage.getItem('jsonwallet')
			console.log(jsonwallet)
			const wallet = await Wallet.decryptWallet(jsonwallet, password)
			console.log(wallet)
			const contract = ContractUtil.loadContract('ArtworkOwnership', wallet.privateKey)
			// const gasCost = await contract.estimate.addGallery(address, name, location)
			// console.log(gasCost)
			const result = await contract.addGallery(address, name, location)
		} catch (error) {
			console.log(error)
		}
	}

	render() {
		const { name, address, location, showWallet, password } = this.state
		return (
			<Container>
				<GalleryForm
					handleInputChange={this.handleInputChange}
					handleSubmit={this.handleSubmit}
					name={name}
					address={address}
					location={location}
				/>
				<Button variant="primary" onClick={this.handleShow}>
					Add Gallery
				</Button>
				<WalletModal
					showWallet={showWallet}
					handleInputChange={this.handleInputChange}
					password={password}
					handleHide={this.handleHide}
					handleShow={this.handleShow}
					handleSubmit={this.handleSubmit}
				/>
			</Container>
		);
	}
}

export default AddGallery
