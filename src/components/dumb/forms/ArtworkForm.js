import React from 'react'
import { FormControl, FormGroup, ControlLabel } from 'react-bootstrap'

const ArtworkForm = props => (
  <form>
    <FormGroup>
      <ControlLabel>Title</ControlLabel>
      <FormControl
        id="title"
        value={props.title}
      />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Artist</ControlLabel>
      <FormControl
        id="artist"
        value={props.artist}
      />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Category</ControlLabel>
      <FormControl
        id="category"
        value={props.category}
      />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Year</ControlLabel>
      <FormControl
        id="year"
        value={props.year}
      />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Title</ControlLabel>
      <FormControl
        id="title"
        value={props.title}
      />
    </FormGroup>
  </form>
)

export default ArtworkForm
