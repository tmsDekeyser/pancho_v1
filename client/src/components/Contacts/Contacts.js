import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Navigation from '../Navbar';
import SaveContact from './SaveContact';
import { ContactList } from './ContactList';

export default class Contacts extends Component {
  constructor() {
    super();
    this.state = { isAuthenticated: true, contacts: {} };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.setState({ isAuthenticated: false });
    } else {
      fetch(`http://localhost:3001/api/v0/wallet/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => this.setState({ contacts: data }));
    }
  }

  render() {
    if (this.state.isAuthenticated) {
      return (
        <div>
          <Navigation activeComponent='contacts' />
          <div className='container'>
            <SaveContact />
            <ContactList contacts={this.state.contacts} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Redirect to='/' />
        </div>
      );
    }
  }
}
