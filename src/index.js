import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap/dist/css/bootstrap-theme.css';
import App from './App'
import Main from './components/smart/Main'
import AddGallery from './components/smart/AddGallery';
import registerServiceWorker from './registerServiceWorker'

const Root = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/add/gallery" component={AddGallery} />
    </Switch>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
