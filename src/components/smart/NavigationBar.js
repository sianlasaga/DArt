import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap/lib'

import ContractUtil from '../../utils/contract'

class NavigationBar extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this)
    this.redirectTo = this.redirectTo.bind(this)
    this.state = {
      canAddArtwork: false,
      isLoggedIn: false
    }
  }

  async componentWillMount() {
    try {
      const jsonwallet = JSON.parse(sessionStorage.getItem('jsonwallet'))
      if (!jsonwallet) return
      const contract = ContractUtil.loadContract('ArtworkOwnership')
      const [,,,canAddArtwork] = await contract.galleries(jsonwallet.address)
      const isLoggedIn = sessionStorage.getItem('jsonwallet')
      this.setState({ canAddArtwork })
      if (isLoggedIn) this.setState({ isLoggedIn: true })
    } catch (error) {
      
    }
  }

  redirectTo(route) {
    this.props.history.push(route)
  }

  logout() {
    sessionStorage.clear()
    window.location.href = '/'
    // window.location.href('
  }
  
  
  render() {
    const { canAddArtwork, isLoggedIn } = this.state
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">DArt</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/artworks">Artworks</Nav.Link>
            <Nav.Link href="/auctions">Auctions</Nav.Link>
          </Nav>
          <Nav>
            {canAddArtwork ? <Nav.Link href="/add/artwork">Add artwork</Nav.Link> : null }
            { isLoggedIn ? <Nav.Link href="/collections">Collections</Nav.Link> : null }
            { isLoggedIn ? <Nav.Link onClick={() => this.logout()}>Log out</Nav.Link> : null }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default NavigationBar
