import React from 'react'
import { Form, Button } from 'react-bootstrap/lib'

const WalletForm = props => (
  <Form>
    {
      !props.shouldGenerateWallet ?
      <Form.Group>
        <Form.Label>Private Key</Form.Label>
        <Form.Control
          id="privateKey"
          name="privateKey"
					value={props.privateKey}
					onChange={props.handleInputChange}
          placeholder="Enter private key"
        />
      </Form.Group> : null
    }
    <Form.Group>
      <Form.Label>Password</Form.Label>
      <Form.Control
        id="password"
        name="password"
				value={props.password}
				onChange={props.handleInputChange}
        placeholder="Enter wallet password"
      />
    </Form.Group>
    <Button variant="primary">
			Confirm
    </Button>
  </Form>
)

export default WalletForm
