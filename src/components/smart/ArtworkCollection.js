import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap/lib'

import ArtworkCard from '../dumb/ArtworkCard'
import Contract from '../../utils/contract'

class ArtworkCollection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      artworks: [],
    }
  }

  async componentWillMount() {
    const { address } = JSON.parse(sessionStorage.getItem('jsonwallet'))
    const contract = new Contract('ArtworkOwnership').contract
    const tokenIds = await contract.tokensOfOwner(address)
    const artworks = await Promise.all(tokenIds.map(async (id) => {
      const tokenId = id.toNumber()
      const [title, category, artist, photoIpfsHash, description, year] = await contract.getArtwork(tokenId)
      return { tokenId, title, category, artist, imgURL: `https://ipfs.io/ipfs/${photoIpfsHash}`, description, year }
    }))
    this.setState({ artworks })
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
