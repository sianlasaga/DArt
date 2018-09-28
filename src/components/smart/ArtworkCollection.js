import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap/lib'

import ArtworkCard from '../dumb/ArtworkCard'
import ContractUtil from '../../utils/contract'

class ArtworkCollection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      artworks: [],
    }
    this.handleCard = this.handleCard.bind(this)
  }

  async componentWillMount() {
    const jsonwallet = JSON.parse(sessionStorage.getItem('jsonwallet'))
    if (!jsonwallet) return
    const contract = ContractUtil.loadContract('ArtworkOwnership')
    const tokenIds = await contract.tokensOfOwner(jsonwallet.address)
    const artworks = await Promise.all(tokenIds.map(async (id) => {
      const tokenId = id.toNumber()
      const [title, category, artist, photoIpfsHash, description, year] = await contract.getArtwork(tokenId)
      return { tokenId, title, category, artist, imgURL: `https://ipfs.io/ipfs/${photoIpfsHash}`, description, year }
    }))
    this.setState({ artworks })
  }

  handleCard(tokenId) {
    this.props.history.push(`/artwork/${tokenId}`)
  }
  
  render() {
    const { artworks } = this.state
    console.log(artworks)
    return (
      <Container>
        <Row>
          {
            artworks.map(artwork =>
              <Col md={3} sm={6} key={artwork.title}>
                <ArtworkCard
                  handleCard={this.handleCard}
                  artwork={artwork}
                />
              </Col>
              )
          }
        </Row>
      </Container>
    )
  }
}

export default ArtworkCollection
