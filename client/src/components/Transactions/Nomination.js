import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class Nomination extends Component {
  constructor() {
    super();
    this.state = { userAddress: '' };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3001/api/v0/auth/me', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => this.setState({ userAddress: json.data.keys[1] }));
  }

  decideNomination = (accept) => {
    const token = localStorage.getItem('token');

    fetch('/api/v0/p2p/nomination-decision', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nomId: this.props.nom.id, accept, amount: 0 }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (accept) {
          alert('You accepted the nomination, wait for the badge tx to appear');
        } else {
          alert('You declined the nomination');
        }
      });
  };

  acceptNomination = () => this.decideNomination(true);
  rejectNomination = () => this.decideNomination(false);

  get displayButtons() {
    if (this.state.userAddress === this.props.nom.data.badge.badgeRecipient) {
      return (
        <div>
          <hr />
          <Button
            className='custom-but'
            variant='success'
            onClick={this.acceptNomination}
          >
            Accept
          </Button>
          <Button
            className='custom-but'
            variant='danger'
            onClick={this.rejectNomination}
          >
            Reject
          </Button>
        </div>
      );
    }
  }

  render() {
    const { id, data } = this.props.nom;

    return (
      <div>
        <div className='tx-header'>
          Type: {data.type} | ID: {id}{' '}
        </div>
        <div>
          Nominator: {data.address.substring(0, 19)}... <br /> Nominee:{' '}
          {data.badge.badgeRecipient.substring(0, 19)}... <br />
          Badge: {data.badge.badgeAddress}
          {'  |  '} Amount: {data.badge.amount} SQM:F
        </div>
        <br />
        <div>{this.displayButtons}</div>
      </div>
    );
  }
}

export default Nomination;
