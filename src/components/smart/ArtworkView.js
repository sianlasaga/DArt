import React, { Component } from 'react'
import { Container, Row, Image, Button } from 'react-bootstrap/lib'

import AuctionForm from '../dumb/forms/AuctionForm'
import WalletModal from '../dumb/WalletModal'

import Contract from '../../utils/contract'
import Wallet from '../../utils/wallet'

class ArtworkView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      artwork: {
        tokenId: '',
        title: '',
        category: '',
        artist: '',
        imgURL: '',
        description: '',
        year: '',
        showWallet: false,
      },
      startingPrice: '',
      maxBid: '',
      bidIncrement: '',
      duration: '',
      password: '',
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleShow = this.handleShow.bind(this)
		this.handleHide = this.handleHide.bind(this)
  }

  async componentWillMount() {
    const { tokenId } = this.props.match.params
    const contract = new Contract('ArtworkOwnership').contract
    const [title, category, artist, photoIpfsHash, description, year] = await contract.getArtwork(tokenId)
    const artwork = { tokenId, title, category, artist, imgURL: `https://ipfs.io/ipfs/${photoIpfsHash}`, description, year }
    this.setState({ artwork })
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
    const { artwork, startingPrice, maxBid, bidIncrement, duration, password } = this.state
    try {
			const jsonwallet = sessionStorage.getItem('jsonwallet')
			const wallet = await Wallet.decryptWallet(jsonwallet, password)
			const contract = new Contract('ArtworkOwnership', wallet.privateKey).contract
      const result = await contract.createAuction(artwork.tokenId, duration, startingPrice, maxBid, bidIncrement)
      console.log(result)
		} catch (error) {
			console.log(error)
		}
  }
  
  render() {
    const { artwork, showWallet, startingPrice, maxBid, bidIncrement, duration, password } = this.state
    const { title, category, artist, imgURL, description, year } = artwork
    return (
      <Container>
        <Row>
          <Image src={imgURL} />
        </Row>
        <Row>
          <h1>{title} ({year})</h1>
          <h3>{artist}</h3>
          <h5>{category}</h5>
          <p>{description}</p>
        </Row>
        <Row>
          <AuctionForm
            startingPrice={startingPrice}
            maxBid={maxBid}
            bidIncrement={bidIncrement}
            duration={duration}
            handleInputChange={this.handleInputChange}
          />
          <Button variant="primary" onClick={this.handleShow}>
            Add Auction
          </Button>
          <WalletModal
            showWallet={showWallet}
            handleInputChange={this.handleInputChange}
            password={password}
            handleHide={this.handleHide}
            handleShow={this.handleShow}
            handleSubmit={this.handleSubmit}
          />
        </Row>
      </Container>
    )
  }
}

export default ArtworkView
