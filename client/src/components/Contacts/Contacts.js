import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Navigation from '../Navbar';
import SaveContact from './SaveContact';
import { ContactList } from './ContactList';
import { API_URL, API_VERSION } from '../../constants';

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
      fetch(`${API_URL}/api/${API_VERSION}/wallet/contacts`, {
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
