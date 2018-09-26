import React from 'react'
import { Form, Button } from 'react-bootstrap/lib'

const WalletForm = props => (
  <Form>
    {
      !props.shouldGenerateWallet ?
      <Form.Group controlId="fromPrivateKey">
        <Form.Label>Private Key</Form.Label>
        <Form.Control
          name="privateKey"
					value={props.privateKey}
					onChange={props.handleInputChange}
          placeholder="Enter private key"
        />
      </Form.Group> : null
    }
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
    <Form.Group controlId="formCheckBox">
      <Form.Check type="checkbox" checked={!props.shouldGenerateWallet} onChange={props.handleCheckBox} label="Open Wallet" />
    </Form.Group>
    <Button variant="primary" onClick={props.handleSubmit}>
			Confirm
    </Button>
  </Form>
)

export default WalletForm
