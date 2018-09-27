import React from 'react'
import { Form, Button } from 'react-bootstrap/lib'

const GalleryForm = props => (
  <Form>
    <Form.Group controlId="formGalleryName">
      <Form.Label>Name</Form.Label>
      <Form.Control
        name="name"
				value={props.name}
				onChange={props.handleInputChange}
        placeholder="Enter gallery name"
      />
    </Form.Group>
    <Form.Group controlId="formGalleryLocation">
      <Form.Label>Location</Form.Label>
      <Form.Control
        name="location"
				value={props.location}
				onChange={props.handleInputChange}
        placeholder="Enter gallery complete address location"
      />
    </Form.Group>
    <Form.Group controlId="formGalleryAddress">
      <Form.Label>Gallery Ethereum Address</Form.Label>
      <Form.Control
        name="address"
				value={props.address}
				onChange={props.handleInputChange}
        placeholder="0x"
      />
    </Form.Group>
  </Form>
)

export default GalleryForm
