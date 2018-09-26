import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Main from './components/smart/Main';
import registerServiceWorker from './registerServiceWorker';

const Root = () => (
  <Router>
    <Route exact path="/" component={Main} />
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
