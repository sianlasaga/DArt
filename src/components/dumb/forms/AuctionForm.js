import React from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap/lib'

const AuctionForm = props => (
  <Form>
    <Form.Group controlId="formStartingPrice">
      <Form.Label>Starting Price</Form.Label>
      <InputGroup className="mb-3">
        <Form.Control
          type="number"
          name="startingPrice"
          value={props.startingPrice}
          onChange={props.handleInputChange}
          placeholder="Enter starting price"
        />
        <InputGroup.Append>
          <InputGroup.Text>FINNEY</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
    </Form.Group>
    <Form.Group controlId="formMaxBid">
      <Form.Label>Maximum Bid</Form.Label>
      <InputGroup className="mb-3">
        <Form.Control
          type="number"
          name="maxBid"
          value={props.maxBid}
          onChange={props.handleInputChange}
          placeholder="Enter max bid"
        />
        <InputGroup.Append>
          <InputGroup.Text>FINNEY</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
    </Form.Group>
    <Form.Group controlId="formBidIncrement">
      <Form.Label>Bid Increment</Form.Label>
      <InputGroup className="mb-3">
        <Form.Control
          type="number"
          name="bidIncrement"
          value={props.bidIncrement}
          onChange={props.handleInputChange}
          placeholder="Enter bid increment"
        />
        <InputGroup.Append>
          <InputGroup.Text>FINNEY</InputGroup.Text>
        </InputGroup.Append>
      </InputGroup>
    </Form.Group>
    <Form.Group controlId="formDuration">
      <Form.Label>Duration</Form.Label>
      <Form.Control
        type="number"
        name="duration"
				value={props.duration}
				onChange={props.handleInputChange}
        placeholder="Enter duration in minutes"
      />
    </Form.Group>
  </Form>
)

export default AuctionForm
