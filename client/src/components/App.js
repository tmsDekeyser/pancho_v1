import React, { Component } from 'react';
import logo from '../assets/zigurat.png';
import Auth from './Auth/Auth';
import Wallet from './Wallet/Wallet';
import Navigation from './Navbar';
import { NO_AUTH } from '../constants';

class App extends Component {
  constructor() {
    super();
    this.state = { isAuthenticated: false };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    if (token || NO_AUTH) {
      this.setState({ isAuthenticated: true });
    }
  }

  componentDidUpdate() {
    const token = localStorage.getItem('token');

    if (token && !this.state.isAuthenticated) {
      this.setState({ isAuthenticated: true });
    }
  }

  render() {
    if (this.state.isAuthenticated) {
      return (
        <div>
          <Navigation activeComponent='wallet' />
          <img src={logo} className='logo' />
          <Wallet />
        </div>
      );
    } else {
      return (
        <div>
          <Navigation />
          <img src={logo} className='logo' />
          <Auth />
        </div>
      );
    }
  }
}

export default App;
