import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap/lib'

import ContractUtil from '../../utils/contract'

class NavigationBar extends Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this)
    this.redirectTo = this.redirectTo.bind(this)
    this.state = {
      isGallerist: false,
      isLoggedIn: false
    }
  }

  async componentWillMount() {
    try {
      const { address } = JSON.parse(sessionStorage.getItem('jsonwallet'))
      const contract = ContractUtil.loadContract('ArtworkOwnership')
      const [name] = await contract.getGalleryByAddress(address)
      const isLoggedIn = sessionStorage.getItem('jsonwallet')
      if (isLoggedIn) this.setState({ isLoggedIn: true })
      if (name !== '') this.setState({ isGallerist: true })
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
    const { isGallerist, isLoggedIn } = this.state
    return (
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">DArt</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {/* <Nav.Link href="/artworks">Artworks</Nav.Link> */}
            <Nav.Link href="/auctions">Auctions</Nav.Link>
          </Nav>
          <Nav>
            {isGallerist ? <Nav.Link href="/add/artwork">Add artwork</Nav.Link> : null }
            <Nav.Link href="/collections">Collections</Nav.Link>
            { isLoggedIn ? <Nav.Link onClick={() => this.logout()}>Log out</Nav.Link> : null }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default NavigationBar
