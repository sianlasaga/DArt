import React from 'react'
import { Card } from 'react-bootstrap/lib'

const ArtworkCard = props => {
  const { artwork, timeRemaining, handleCard, isAuction } = props
  return (
    <Card style={{ cursor: 'pointer', padding: '2.5%' }} onClick={() => handleCard(isAuction ? props.auction.id : artwork.tokenId)}>
      <Card.Img variant="top" style={{ height: '10em' }} thumbnail fluid src={artwork.imgURL} />
      <Card.Body style={{ paddingTop: '2.5%', paddingBottom: '2.5%'}}>
        <Card.Title style={{ marginBottom: '1%'}}>{artwork.title} ({artwork.year})</Card.Title>
        <Card.Text>{artwork.artist}</Card.Text>
        {/* { props.isAuction ?
          <Card.Text>{timeRemaining}</Card.Text> : null
        } */}
      </Card.Body>
    </Card>
  )
}

export default ArtworkCard
