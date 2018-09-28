import React, { Component } from 'react'
import { Container, Row, Image, Button, Jumbotron } from 'react-bootstrap/lib'
import ethers from 'ethers'

import AuctionForm from '../dumb/forms/AuctionForm'
import WalletModal from '../dumb/WalletModal'

import ContractUtil from '../../utils/contract'
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
      canCreateAuction: false,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleShow = this.handleShow.bind(this)
		this.handleHide = this.handleHide.bind(this)
  }

  async componentWillMount() {
    try {
      const { tokenId } = this.props.match.params
      const contract = ContractUtil.loadContract('ArtworkOwnership')
      const [title, category, artist, photoIpfsHash, description, year] = await contract.getArtwork(tokenId)
      const artwork = { tokenId, title, category, artist, imgURL: `https://ipfs.io/ipfs/${photoIpfsHash}`, description, year }
      this.setState({ artwork })
      const jsonwallet = JSON.parse(sessionStorage.getItem('jsonwallet'))
      const [,,,,canCreateAuction] = await contract.galleries(jsonwallet.address)
      this.setState({ canCreateAuction })
    } catch (error) {
      console.log(error)
    }
    
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
			const contract = ContractUtil.loadContract('ArtworkOwnership', wallet.privateKey)
      const result = await contract.createAuction(artwork.tokenId, duration * 60, ethers.utils.parseEther((startingPrice / 1000).toString()), ethers.utils.parseEther((maxBid / 1000).toString()), ethers.utils.parseEther((bidIncrement / 1000).toString()))
      console.log(result)
      this.props.history.push('/auctions')
		} catch (error) {
			console.log(error)
		}
  }
  
  render() {
    const { artwork, canCreateAuction, showWallet, startingPrice, maxBid, bidIncrement, duration, password } = this.state
    const { title, category, artist, imgURL, description, year } = artwork
    return (
      <Container>
        <Row>
          <Image style={{ margin: 'auto', maxWidth: '50em', maxHeight: '100em'}} src={imgURL} />
        </Row>
        <div style={{ margin: 'auto', maxWidth: '50em' }}>
          <Row><h1>{title} ({year})</h1></Row>
          <Row><h3>{artist}</h3></Row>
          <Row><h5>{category}</h5></Row>
          <Row><p>{description}</p></Row>
        </div>
        {
          canCreateAuction ? (
            <Row style={{ marginTop: '7.5%' }}>
              <Jumbotron style={{ margin: 'auto', paddingTop: '3%', minWidth: '25em', maxWidth: '40em' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '5%' }}>Create Auction</h3>
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
              </Jumbotron>
            </Row>
          ) : null
        }
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

export default ArtworkView
