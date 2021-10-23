import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { API_URL, API_VERSION, NO_AUTH } from '../../constants';
import { Address } from '../utils/Address';

class Nomination extends Component {
  constructor() {
    super();
    this.state = { userAddress: '' };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(`${API_URL}/api/${API_VERSION}/auth/me`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((json) => this.setState({ userAddress: json.data.keys[1] }));
    } else if (NO_AUTH) {
      fetch(`${API_URL}/api/${API_VERSION}/wallet/wallet-info`)
        .then((response) => response.json())
        .then((data) => this.setState({ userAddress: data.address }));
    }
  }

  decideNomination = (accept) => {
    const token = localStorage.getItem('token');

    fetch(`/api/${API_VERSION}/p2p/nomination-decision`, {
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
          Nominator: <Address address={data.address} readable={true} /> <br />{' '}
          Nominee:{' '}
          <Address address={data.badge.badgeRecipient} readable={true} /> <br />
          Badge: <Address address={data.badge.badgeAddress} />
          {'  |  '} Amount: {data.badge.amount} SQM:F
        </div>
        <br />
        <div>{this.displayButtons}</div>
      </div>
    );
  }
}

export default Nomination;
