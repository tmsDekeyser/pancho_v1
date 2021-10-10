import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { API_URL, API_VERSION } from '../../constants';

class SaveContact extends Component {
  constructor() {
    super();
    this.state = { alias: '', address: '' };
  }

  updateAlias = (event) => {
    this.setState({ alias: event.target.value });
  };

  updateAddress = (event) => {
    this.setState({ address: event.target.value });
  };

  postContact = () => {
    const { alias, address } = this.state;
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/api/${API_VERSION}/wallet/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ alias, address }),
    })
      .then((response) => {
        if (response.status === 200) {
          alert('Contact added!');
          this.props.history.push('/contacts');
        }
      })
      .catch((err) => console.error(err));
    //Add more error handling?
  };

  render() {
    return (
      <div id='save-contact'>
        <Form>
          <Form.Group className='mb-2' controlId='formAlias'>
            <Form.Label>Contact Alias:</Form.Label>
            <Form.Control
              type='text'
              placeholder='Alias'
              value={this.state.alias}
              onChange={this.updateAlias}
            />
          </Form.Group>

          <Form.Group className='mb-2' controlId='formAddress'>
            <Form.Label>Contact Address:</Form.Label>
            <Form.Control
              type='text'
              placeholder='Address'
              value={this.state.address}
              onChange={this.updateAddress}
            />
          </Form.Group>
          <Button variant='dark' onClick={this.postContact}>
            Save Contact
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(SaveContact);
