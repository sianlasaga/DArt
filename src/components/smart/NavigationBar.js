import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap/lib'

class NavigationBar extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this)
  }

  logout() {
    console.log('yyy')
    sessionStorage.clear()
  }
  
  
  render() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">DArt</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/add/artwork">Add artwork</Nav.Link>
            <Nav.Link href="/add/artwork">Artworks</Nav.Link>
            <Nav.Link href="/add/artwork">Auctions</Nav.Link>
            <Nav.Link href="/collections">Collections</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={() => this.logout()}>Log out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default NavigationBar
