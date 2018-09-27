import React from 'react'
import { Form, Button } from 'react-bootstrap/lib'

const ArtworkForm = props => (
  <Form>
    <Form.Group controlId="formArtworkName">
      <Form.Label>Title</Form.Label>
      <Form.Control
        name="title"
        value={props.title}
        onChange={props.handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formArtworkArtist">
      <Form.Label>Artist</Form.Label>
      <Form.Control
        name="artist"
        value={props.artist}
        onChange={props.handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formArtworkCategory">
      <Form.Label>Category</Form.Label>
      <Form.Control
        name="category"
        value={props.category}
        onChange={props.handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formArtworkYear">
      <Form.Label>Year</Form.Label>
      <Form.Control
        name="year"
        value={props.year}
        onChange={props.handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formArtworkDescription">
      <Form.Label>Description</Form.Label>
      <Form.Control
        name="description"
        as="textarea"
        rows="3"
        value={props.description}
        onChange={props.handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formArtworkImage">
      <Form.Label>Upload image</Form.Label>
      <Form.Control
        name="imageUploads"
        type="file"
        ref={props.handleUpload}
      />
    </Form.Group>
    <Form.Group controlId="formPassword">
      <Form.Label>Wallet Password</Form.Label>
      <Form.Control
        type="password"
        name="password"
				value={props.password}
				onChange={props.handleInputChange}
        placeholder="Enter your wallet password"
      />
    </Form.Group>
    <Button variant="primary" onClick={props.handleSubmit}>
			Add Artwork
    </Button>
  </Form>
)

export default ArtworkForm
