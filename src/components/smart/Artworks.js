import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap/lib'

import ArtworkCard from '../dumb/ArtworkCard'
import ContractUtil from '../../utils/contract'

import { availableCategories, limitPerCategory } from '../../config'

class Artwork extends Component {

  constructor(props) {
    super(props);
    this.state = {
      artworks: {},
    }
    this.handleCard = this.handleCard.bind(this)
  }

  async componentWillMount() {
    const contract = ContractUtil.loadContract('ArtworkOwnership')
    availableCategories.forEach(async (category) => {
      let limit = limitPerCategory
      let tokens = await contract.getArtworksByCategory(category)
      if (tokens.length < limit) limit = tokens.length
      tokens = tokens.slice(0, limit)
      const artworks = await Promise.all(tokens.map(async (tokenId) => {
        const [title, category, artist, photoIpfsHash, description, year] = await contract.getArtwork(tokenId)
        return { tokenId, title, category, artist, imgURL: `https://ipfs.io/ipfs/${photoIpfsHash}`, description, year }
      }))
      this.setState({ artworks: { ...this.state.artworks, [category]: artworks }})
    })
  }

  handleCard(tokenId) {
    this.props.history.push(`/artwork/${tokenId}`)
  }
  
  render() {
    const { artworks } = this.state
    console.log(artworks)
    return (
      <Container>
        {/* <Row style={{ paddingTop: '2%', paddingBottom: '2%' }}> */}
          {
            availableCategories.map(category => {
              if (!artworks[category] || artworks[category].length === 0) return null
              return (
                <div style={{ marginTop: '2.5%', marginBottom: '2.5%' }}>
                  <Row><h3>{category}</h3></Row>
                  <Row>
                    {
                      artworks[category].map(artwork =>
                        <Col md={3} sm={6} key={artwork.title}>
                          <ArtworkCard
                            handleCard={this.handleCard}
                            artwork={artwork}
                          />
                        </Col>
                        )
                    }
                  </Row>
                </div>
              )
            })
          }
        {/* </Row> */}
      </Container>
    )
  }
}

export default Artwork
