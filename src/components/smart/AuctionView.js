import React, { Component } from 'react'
import { Container, Row, Col, Image, Button, Form, InputGroup, Jumbotron } from 'react-bootstrap/lib'
import moment from 'moment'
import ethers from 'ethers'

import WalletModal from '../dumb/WalletModal'

import ContractUtil from '../../utils/contract'
import Wallet from '../../utils/wallet'
import { provider } from '../../config';

class AuctionView extends Component {

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
        isOwner: false
      },
      auction: null,
      isOwner: false,
      bidAmount: 0,
      // timeLeft: '',
      wallet: null,
      hasEnded: false,
      showWallet: false,
      timeRemaining: '',
      userAddress: '',
      auctionAddress: '',
      action: 1,
      balance: 0,
      password: '',
      userTotalBid: 0,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
    this.renderBidding = this.renderBidding.bind(this)
    this.renderGalleryButtons = this.renderGalleryButtons.bind(this)
    this.renderBiddingInfo = this.renderBiddingInfo.bind(this)
    this.handleOpenWallet = this.handleOpenWallet.bind(this)
    this.renderAccountBalance = this.renderAccountBalance.bind(this)
    this.loadBalance = this.loadBalance.bind(this)
    this.handleUserWithdraw = this.handleUserWithdraw.bind(this)
  }

  async componentWillMount() {
    const { auctionId } = this.props.match.params
    const { address } = JSON.parse(sessionStorage.getItem('jsonwallet'))
    const contract = ContractUtil.loadContract('ArtworkOwnership')
    const auctionAddress = await contract.auctions(auctionId)
    const auction = await ContractUtil.loadAuctionByAddress(auctionAddress)
    const owner = await auction.owner()
    const isOwner = `0x${address.toLowerCase()}` === owner.toLowerCase()
    console.log(isOwner)
    if (isOwner) this.setState({ isOwner: true })
    else {
      const userTotalBid = await auction.getTotalBidByAddress(address)
      this.setState({ showWallet: true, userTotalBid: userTotalBid / 10**15 })
    }
    const tokenId = await auction.tokenId()
    let timeLeft = (await auction.getTimeRemaining()).toNumber()
    let timeRemaining = ''
    const auctionData = {
      owner: await auction.owner(),
      endDate: (await auction.endDate()) * 1000,
      startingBid: await auction.startingBid(),
      bidIncrement: await auction.bidIncrement(),
      tokenId,
      maxBid: await auction.highestAllowedBidAmount(),
      highestBid: await auction.getHighestBid(),
      highestBidder: await auction.highestBidder(),
    }
    const [title, category, artist, photoIpfsHash, description, year] = await contract.getArtwork(tokenId)
    const artwork = { tokenId, title, category, artist, imgURL: `https://ipfs.io/ipfs/${photoIpfsHash}`, description, year }
    this.setState({ auctionAddress, artwork, auction: auctionData, userAddress: address })
    let duration = moment.duration(timeLeft, 'seconds')
    let currentHighestBid = auctionData.highestBid
    setInterval(async () => {
      timeLeft--
      if (timeLeft <= 0) this.setState({ hasEnded: true })
      duration = moment.duration(timeLeft, 'seconds')
      timeRemaining = duration.hours() + ":" + duration.minutes() + ":" + duration.seconds()
      this.setState({ timeRemaining })
      const highestBid = await auction.getHighestBid()
      if (highestBid !== currentHighestBid) {
        const highestBidder = await auction.highestBidder()
        currentHighestBid = highestBid
        this.setState({ bidAmount: (highestBid / 10**15) + (auctionData.bidIncrement) / 10**15, auction: { ...this.state.auction, highestBidder, highestBid }})
      }
    }, 1000)
    
  }

  handleInputChange(e) {
		e.preventDefault()
		const { name, value } = e.target
		this.setState({ [name]: value })
  }

  handleShow(action) {
    if (action) this.setState({ action })
		this.setState({ showWallet: true })
	}

	handleHide() {
		this.setState({ showWallet: false })
  }

  async handleSubmit() {
    const { bidAmount, password, auctionAddress, isOwner, action } = this.state
    let { wallet } = this.state
    console.log(action)
    const jsonwallet = sessionStorage.getItem('jsonwallet')
    try {
      if (!wallet) wallet = await Wallet.decryptWallet(jsonwallet, password)
      const auction = await ContractUtil.loadAuctionByAddress(auctionAddress, wallet.privateKey)
      if (action === 1) {
        console.log(parseInt(bidAmount) / 1000)
        const totalBid = await auction.getTotalBidByAddress(wallet.address)
        const result = await auction.placeBid({ value: ethers.utils.parseEther((parseFloat(bidAmount - (totalBid) / 10**15) / 1000).toString()) })
        console.log(result)
        this.setState({ userTotalBid: bidAmount })
      } else if (action === 2) {
        const result2 = await auction.transferToken()
        console.log(result2)
        const result1 = await auction.withdraw()
        console.log(result1)
      } else if (action === 3) {
        const result = await auction.cancel()
        console.log(result)
      } else if (action === 4) {
        const result = await auction.withdraw()
        console.log(result)
      }
      this.loadBalance()
    } catch (error) {
      console.log(error)
    }
  }

  async handleOpenWallet() {
    const { password, isOwner } = this.state
    const jsonwallet = sessionStorage.getItem('jsonwallet')
    try {
      let wallet = await Wallet.decryptWallet(jsonwallet, password)
      if (!wallet.provider) wallet = new ethers.Wallet(wallet.privateKey, provider)
      this.setState({ wallet, showWallet: false })
      this.loadBalance()
      if (isOwner) this.handleSubmit()
    } catch (error) {
      console.log(error)
    }
  }

  handleUserWithdraw() {
    this.setState({ action: 4 })
    this.handleSubmit()
  }

  async loadBalance() {
    const { wallet } = this.state
    if (wallet) {
      const balance = await wallet.getBalance()
      this.setState({ balance })
    }
  }

  renderGalleryButtons() {
    const { hasEnded } = this.state
    return (
      <Row style={{ marginTop: '3%' }}>
        <Col>
          <Button variant="secondary" style={{ width: '100%', marginRight: '2.5%', marginLeft: '2.5%' }} onClick={() => this.handleShow(3)} disabled={hasEnded}>Cancel Auction</Button>
        </Col>
        <Col>
          <Button variant="primary" style={{ width: '100%', marginRight: '2.5%', marginLeft: '2.5%' }} onClick={() => this.handleShow(2)} disabled={!hasEnded}>Withdraw and Transfer Token</Button>
        </Col>
      </Row>
    )
  }

  renderBidding() {
    const { hasEnded, bidAmount, wallet, auction, userTotalBid } = this.state
    if (wallet) {
      if (hasEnded && wallet.address.toLowerCase() === auction.highestBidder.toLowerCase()) {
        return <h5 style={{ textAlign: 'center' }}>Congratulations! You won!</h5>
      } else if (userTotalBid === 0) {
        return null
      }
      else if (hasEnded) {
        return (
          <Row>
            <Button style={{ width: '50%', margin: 'auto' }} onClick={() => this.handleUserWithdraw()}>Withdraw</Button>
          </Row>
        )
      }
      return (
        <Form>
          <Row>
            <Form.Group style={{ margin: 'auto'}} controlId="formBidAmount">
              <Form.Label>Bid amount</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="number"
                  name="bidAmount"
                  value={bidAmount}
                  onChange={this.handleInputChange}
                  placeholder="Enter bid amount"
                />
                <InputGroup.Append>
                  <InputGroup.Text>FIN</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>
            </Row>
          <Row>
            <Button style={{ width: '50%', margin: 'auto' }} variant="primary" onClick={() => this.handleSubmit()} disabled={hasEnded}>Place bid</Button>
          </Row>
        </Form>
      )
    }
    return (
      <Row>
        <Button variant="primary" style={{ width: '50%', margin: 'auto' }}  onClick={() => this.handleShow()}>Open Wallet</Button>
      </Row>
    )
  }

  renderBiddingInfo() {
    const { hasEnded, auction, timeRemaining, isOwner } = this.state
    if (auction) {
      return (
        <Jumbotron style={{ margin: 'auto', padding: '5%', paddingTop: '3%', paddingBottom: '3%', minWidth: '30em', maxWidth: '40em' }}>
          { !hasEnded ? <h3 style={{ textAlign: 'center' }}>Time Left: {timeRemaining}</h3> : <h3 style={{ textAlign: 'center' }}>Auction has ended</h3>}
          {
            auction.highestBidder === '0x0000000000000000000000000000000000000000' ?
            <h5 style={{ textAlign: 'center' }}>Starting bid: {auction.startingBid / 10 ** 15} FIN</h5>
            : <h5 style={{ textAlign: 'center' }}>Current highest bid: {auction.highestBid / 10 ** 15} FIN ({auction.highestBidder})</h5>
          }
          <Row>
            <Col>
              <h5 style={{ textAlign: 'center' }}>Bid limit: {auction.maxBid / 10**15} FIN</h5>
            </Col>
            <Col>
              <h5 style={{ textAlign: 'center' }}>Bid increment: {auction.bidIncrement / 10**15} FIN</h5>
            </Col>
          </Row>
          { !isOwner ? this.renderAccountBalance() : null }
          {
            isOwner ? this.renderGalleryButtons() : this.renderBidding()
          }
        </Jumbotron>
      )
    }
  }

  renderAccountBalance() {
    const { balance, userTotalBid } = this.state
    if (balance) {
      return (
        <div>
          <h5 style={{ textAlign: 'center' }}>Your bid: {userTotalBid} FIN</h5>
          <h6 style={{ textAlign: 'center' }}>Account balance: {(balance / 10**15).toFixed(4)} FIN</h6>
        </div>
      )
    }
    return null
  }
  
  render() {
    const { artwork, showWallet, isOwner, startingPrice, maxBid, bidIncrement, duration, password } = this.state
    const { title, category, artist, imgURL, description, year } = artwork
    return (
      <Container>
        <Row>
          <Image style={{ margin: 'auto', minWidth: '15em', maxWidth: '50em', minHeight: '30em', maxHeight: '100em' }} src={imgURL} />
        </Row>
        <div style={{ margin: 'auto', maxWidth: '50em' }}>
          <Row><h1>{title} ({year})</h1></Row>
          <Row><h3>{artist}</h3></Row>
          <Row><h5>{category}</h5></Row>
          <Row><p>{description}</p></Row>
        </div>
        {this.renderBiddingInfo()}
        <Row>
          <WalletModal
            showWallet={showWallet}
            handleInputChange={this.handleInputChange}
            password={password}
            handleHide={this.handleHide}
            handleShow={() => this.handleShow}
            handleSubmit={this.handleOpenWallet}
          />
        </Row>
      </Container>
    )
  }
}

export default AuctionView
