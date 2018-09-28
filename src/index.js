import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
import { Container } from 'react-bootstrap/lib'
// import 'bootstrap/dist/css/bootstrap-theme.css';
import App from './App'
import NavigationBar from './components/smart/NavigationBar';
import Main from './components/smart/Main'
import AddGallery from './components/smart/AddGallery'
import AddArtwork from './components/smart/AddArtwork'
import ArtworkView from './components/smart/ArtworkView'
import Auctions from './components/smart/Auctions'
import AuctionView from './components/smart/AuctionView'
import ArtworkCollection from './components/smart/ArtworkCollection'
import registerServiceWorker from './registerServiceWorker'

const Root = () => (
  <Router>
    <div>
      <NavigationBar />
      <Container>
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/add/gallery" component={AddGallery} />
          <Route path="/add/artwork" component={AddArtwork} />
          <Route path="/collections" component={ArtworkCollection} />
          <Route path="/auctions" component={Auctions} />
          <Route path="/artwork/:tokenId" component={ArtworkView} />
          <Route path="/auction/:auctionId" component={AuctionView} />
        </Switch>
      </Container>
    </div>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
