import React, { Component } from 'react';
import { API_URL, API_VERSION } from '../../constants';
import BadgeList from './BadgeList';

class Wallet extends Component {
  constructor() {
    super();
    this.state = {
      walletInfo: { address: '', balance: 0, flow: 0 },
    };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/api/${API_VERSION}/wallet/wallet-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => this.setState({ walletInfo: data }));
  }

  render() {
    const { walletInfo } = this.state;

    return (
      <div className='container'>
        <div className='wallet-info'>
          <div className='block-header'>Address:</div>
          <div className='block-body'>{walletInfo.address}</div>
          <div className='block-header'>Balance:</div>
          <div className='block-body'>
            Tokens: <strong>{walletInfo.balance}</strong>
            {'    '}
            SQM:T
            <br />
            Flow: <strong>{walletInfo.flow}</strong>
            {'    '}
            SQM:F
          </div>
        </div>
        <hr />
        <h2>Badges</h2>
        <BadgeList />
      </div>
    );
  }
}

export default Wallet;
