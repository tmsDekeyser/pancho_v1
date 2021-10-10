import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from './components/App';
import Blocks from './components/Blockchain/Blocks';
import Mempool from './components/Mempool';
import Transact from './components/Transact/Transact';
import Contacts from './components/Contacts/Contacts';
import Auth from './components/Auth/Auth';

import './index.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

render(
  <Router>
    <Switch>
      <Route exact path='/' component={App} />
      <Route path='/blocks' component={Blocks} />
      <Route path='/mempool' component={Mempool} />
      <Route path='/transact' component={Transact} />
      <Route path='/contacts' component={Contacts} />
      <Route path='/auth' component={Auth} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
