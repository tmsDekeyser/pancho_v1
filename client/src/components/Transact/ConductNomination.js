import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { API_URL, API_VERSION } from '../../constants';

export default class ConductNomination extends Component {
  constructor() {
    super();
    this.state = { recipient: '', badgeAddress: '', amount: 0 };
  }

  updateRecipient = (event) => {
    this.setState({ recipient: event.target.value });
  };

  updateBadgeAddress = (event) => {
    this.setState({ badgeAddress: event.target.value });
  };

  updateAmount = (event) => {
    this.setState({ amount: Number(event.target.value) });
  };

  nominate = () => {
    const { recipient, badgeAddress, amount } = this.state;
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/api/${API_VERSION}/p2p/nominate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ badgeRecipient: recipient, badgeAddress, amount }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        alert('Nomination added to mempool');
        this.props.history.push('/mempool');
      })
      .catch((err) => alert(`Whoops, something went wrong: ${err}`));
  };

  render() {
    const options = [
      { value: 'chocolate', label: 'Chocolate' },
      { value: 'strawberry', label: 'Strawberry' },
      { value: 'vanilla', label: 'Vanilla' },
    ];
    console.log;
    return (
      <div>
        <Form>
          <Form.Group className='mb-2' controlId='formNominee'>
            <Form.Label>Nominee</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter recipient address or alias'
              value={this.state.recipient}
              onChange={this.updateRecipient}
            />
            <Form.Text className='text-muted'>
              Believe this person deserves special consideration?
            </Form.Text>
          </Form.Group>

          <Form.Group className='mb-2' controlId='formNominee'>
            <Form.Label>Badge Address</Form.Label>
            {/* <Select options={options} /> */}
            <Form.Control
              type='text'
              placeholder='Enter badge address'
              value={this.state.badgeAddress}
              onChange={this.updateBadgeAddress}
            />
            <Form.Text className='text-muted'>
              Pick a badge from the available addresses!
            </Form.Text>
          </Form.Group>

          <Form.Group className='mb-2' controlId='formNominate'>
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type='number'
              placeholder='0'
              value={this.state.amount}
              onChange={this.updateAmount}
            />
          </Form.Group>
          <Button variant='dark' onClick={this.nominate}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
