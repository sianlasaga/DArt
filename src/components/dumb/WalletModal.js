import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap/lib'

const WalletModal = props => (
  <Modal show={props.showWallet} onHide={props.handleHide}>
    <Modal.Header>Unlock Wallet</Modal.Header>
    <Modal.Body>
      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={props.password}
          onChange={props.handleInputChange}
          placeholder="Enter wallet password"
        />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={props.handleHide}>Close</Button>
      <Button variant="primary" onClick={props.handleSubmit}>Confirm</Button>
    </Modal.Footer>
  </Modal>
)

export default WalletModal
