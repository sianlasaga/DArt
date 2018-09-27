import React, { Component } from 'react'
import { Container } from 'react-bootstrap/lib'

import Contract from '../../utils/contract'
import Wallet from '../../utils/wallet'
import GalleryForm from '../dumb/forms/GalleryForm'

class AddGallery extends Component {

	constructor(props) {
		super(props)
		this.state = {
			name: '',
			address: '',
			location: '',
			password: '',
		}
		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleInputChange(e) {
		e.preventDefault()
		const { name, value } = e.target
		this.setState({ [name]: value })
	}

	async handleSubmit(e) {
		e.preventDefault()
		const { name, address, location, password } = this.state
		try {
			const jsonwallet = sessionStorage.getItem('jsonwallet')
			console.log(jsonwallet)
			const wallet = await Wallet.decryptWallet(jsonwallet, password)
			console.log(wallet)
			const contract = new Contract('ArtworkOwnership', wallet.privateKey).contract
			const result = await contract.addGallery(address, name, location)
		} catch (error) {
			console.log(error)
		}
	}

	render() {
		const { name, address, location } = this.state
		return (
			<Container>
				<GalleryForm
					handleInputChange={this.handleInputChange}
					handleSubmit={this.handleSubmit}
					name={name}
					address={address}
					location={location}
				/>
			</Container>
		);
	}
}

export default AddGallery
