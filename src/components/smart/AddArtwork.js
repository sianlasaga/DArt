import React, { Component } from 'react'
import { Container, Button, Jumbotron } from 'react-bootstrap/lib';

import ArtworkForm from '../dumb/forms/ArtworkForm'
import ContractUtil from '../../utils/contract'
import Wallet from '../../utils/wallet'
import { upload } from '../../utils/ipfs'
import WalletModal from '../dumb/WalletModal'

class AddArtwork extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      category: '',
      artist: '',
      photoIpfsHash: null,
      imageUploads: null,
      description: '',
      year: '',
      password: '',
      showWallet: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
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
    const { title, category, artist, photoIpfsHash, imageUploads, description, year, password } = this.state
    console.log(imageUploads.files[0])
    const file = imageUploads.files[0]
    upload(file, async (err, response) => {
      if (err) console.log(err)
      console.log(response)
      const jsonwallet = sessionStorage.getItem('jsonwallet')
      const wallet = await Wallet.decryptWallet(jsonwallet, password)
      const contract = ContractUtil.loadContract('ArtworkOwnership', wallet.privateKey)
      const result = await contract.addArtwork(title, category, artist, response[0].hash, description, year)
      console.log(result)
      this.props.history.push('/collections')
    })
  }

  handleUpload(ref) {
    this.setState({ imageUploads: ref })
  }
  
  render() {
    const { title, category, artist, photoIpfsHash, description, year, password, showWallet } = this.state
    return (
      <Container style={{ padding: '5%'}}>
        <Jumbotron style={{ paddingTop: '4%'}}>
          <h2 style={{ textAlign: 'center', marginBottom: '4%' }}>Add Artwork</h2>
          <ArtworkForm
            title={title}
            category={category}
            artist={artist}
            photoIpfsHash={photoIpfsHash}
            description={description}
            year={year}
            password={password}
            handleInputChange={this.handleInputChange}
            handleSubmit={this.handleSubmit}
            handleUpload={this.handleUpload}
          />
          <Button variant="primary" onClick={this.handleShow}>
            Add Artwork
          </Button>
        </Jumbotron>
        <WalletModal
          showWallet={showWallet}
          handleInputChange={this.handleInputChange}
          password={password}
					handleHide={this.handleHide}
					handleShow={this.handleShow}
					handleSubmit={this.handleSubmit}
				/>
      </Container>
    )
  }
}

export default AddArtwork
