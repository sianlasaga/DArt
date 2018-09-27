import React from 'react'
import { Card } from 'react-bootstrap/lib'

const ArtworkCard = props => {
  const { artwork, timeRemaining, handleCard } = props
  return (
    <Card style={{ cursor: 'pointer' }} onClick={() => handleCard(artwork.tokenId)}>
      <Card.Img variant="top" style={{ height: '12em' }} thumbnail fluid src={artwork.imgURL} />
      <Card.Body>
        <Card.Title>{artwork.title}</Card.Title>
        <Card.Text>{artwork.artist}</Card.Text>
        <Card.Text>{artwork.year}</Card.Text>
        {/* { props.isAuction ?
          <Card.Text>{timeRemaining}</Card.Text> : null
        } */}
      </Card.Body>
    </Card>
  )
}

export default ArtworkCard
