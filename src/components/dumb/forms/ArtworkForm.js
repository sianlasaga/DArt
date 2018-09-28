import React from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap/lib'

import { availableCategories } from '../../../config'

const ArtworkForm = props => (
  <Form>
    <Row>
      <Col>
        <Form.Group controlId="formArtworkName">
          <Form.Label>Title</Form.Label>
          <Form.Control
            name="title"
            value={props.title}
            onChange={props.handleInputChange}
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId="formArtworkArtist">
          <Form.Label>Artist</Form.Label>
          <Form.Control
            name="artist"
            value={props.artist}
            onChange={props.handleInputChange}
          />
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col>
        <Form.Group controlId="formArtworkCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            name="category"
            value={props.category}
            onChange={props.handleInputChange}
          >
          {
            availableCategories.map(category =>
              <option value={category}>{category}</option>)
          }
          </Form.Control>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId="formArtworkYear">
          <Form.Label>Year</Form.Label>
          <Form.Control
            name="year"
            type="number"
            value={props.year}
            onChange={props.handleInputChange}
          />
        </Form.Group>
      </Col>
    </Row>
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
  </Form>
)

export default ArtworkForm
