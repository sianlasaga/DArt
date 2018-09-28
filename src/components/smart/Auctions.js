import React, { Component } from 'react'
import { Container, Button, Row, Col } from 'react-bootstrap/lib'

import ArtworkCard from '../dumb/ArtworkCard'

import ContractUtil from '../../utils/contract'
import Wallet from '../../utils/wallet'

class Auctions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentGalleryAuctions: [],
      ongoingAuctions: [],
      subscribedAuctions: [],
    }
    this.handleCard = this.handleCard.bind(this)
    this.renderAuctions = this.renderAuctions.bind(this)
  }

  async componentWillMount() {
    const { address } = JSON.parse(sessionStorage.getItem('jsonwallet'))
    try {
      const contract = ContractUtil.loadContract('ArtworkOwnership')
      const auctionAddresses = await contract.getAllAuctionAddresses()
      console.log(auctionAddresses)
      let auctionId
      for (auctionId = 0; auctionId < auctionAddresses.length; auctionId++) {
        const auctionAddress = auctionAddresses[auctionId]
        const auction = await ContractUtil.loadAuctionByAddress(auctionAddress)
        const isOngoing = !(await auction.hasEnded())
        const isSubscribed = await auction.isUserSubscribed(address)
        if (isOngoing || isSubscribed) {
          const tokenId = await auction.tokenId()
          const auctionData = {
            id: auctionId,
            owner: await auction.owner(),
            startDate: (await auction.startDate()) * 1000,
            endDate: (await auction.endDate()) * 1000,
            startingBid: await auction.startingBid(),
            bidIncrement: await auction.bidIncrement(),
            tokenId: tokenId,
            maxBid: await auction.highestAllowedBidAmount(),
            highestBid: await auction.getHighestBid(),
          }
          const [title, category, artist, photoIpfsHash, description, year] = await contract.getArtwork(auction.tokenId)
          const artwork = { tokenId, title, category, artist, imgURL: `https://ipfs.io/ipfs/${photoIpfsHash}`, description, year }
          const isOwner = `0x${address.toLowerCase()}` === auctionData.owner.toLowerCase()
          const hasOwnerWithdrawn = await auction.hasOwnerWithdrawn()
          if (isOwner && !hasOwnerWithdrawn) this.setState({ currentGalleryAuctions: [...this.state.currentGalleryAuctions, { auction: auctionData, artwork }]})
          else if (!isOwner && isOngoing) this.setState({ ongoingAuctions: [...this.state.ongoingAuctions, { auction: auctionData, artwork }]})
          else if (!isOwner && isSubscribed) this.setState({ subscribedAuctions: [...this.state.subscribedAuctions, { auction: auctionData, artwork }]})
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  handleCard(auctionId) {
    this.props.history.push(`/auction/${auctionId}`)
  }

  renderAuctions(auctions) {
    return auctions.map(auction =>
      <Col md={3} sm={6} key={auction.artwork.title}>
        <ArtworkCard
          isAuction={true}
          handleCard={this.handleCard}
          artwork={auction.artwork}
          auction={auction.auction}
        />
      </Col>)
  }
  
  render() {
    const { ongoingAuctions, subscribedAuctions, currentGalleryAuctions } = this.state
    console.log(ongoingAuctions)
    console.log(subscribedAuctions)
    return (
      <Container>
        {
          currentGalleryAuctions.length > 0 ?
          <Row>
            <Row><h3>Your Auctions</h3></Row>
            <Row>{this.renderAuctions(currentGalleryAuctions)}</Row>
          </Row> : null
        }
        {
          subscribedAuctions.length > 0 ?
          <Row>
            <Row><h3>Subscribed Auctions</h3></Row>
            <Row>{this.renderAuctions(subscribedAuctions)}</Row>
          </Row> : null
        }
        {
          ongoingAuctions.length > 0 ?
          <Row>
            <Row>
              <h3>Ongoing Auctions</h3>
            </Row>
            <Row>{this.renderAuctions(ongoingAuctions)}</Row>
          </Row> : null
        }
      </Container>
    )
  }
}

export default Auctions