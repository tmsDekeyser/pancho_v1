import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { API_URL, API_VERSION } from '../../constants';

export default class ConductTransaction extends Component {
  constructor() {
    super();
    this.state = { recipient: '', amount: 0 };
  }

  updateRecipient = (event) => {
    this.setState({ recipient: event.target.value });
  };

  updateAmount = (event) => {
    this.setState({ amount: Number(event.target.value) });
  };

  postTransaction = () => {
    const { recipient, amount } = this.state;
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/api/${API_VERSION}/p2p/transact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipient, amount }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (!json.error) {
          alert('Transaction added to mempool');
          this.props.history.push('/mempool');
        } else {
          alert(`Transaction failed: ${json.error}`);
        }
      })
      .catch((err) => alert(`Whoops, something went wrong: ${err}`));
  };

  render() {
    return (
      <div>
        <Form>
          <Form.Group className='mb-2' controlId='formTransact'>
            <Form.Label>Transaction recipient</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter recipient address or alias'
              value={this.state.recipient}
              onChange={this.updateRecipient}
            />
            <Form.Text className='text-muted'>
              Show your appreciation for a valuable interaction!
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
          <Button variant='dark' onClick={this.postTransaction}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
