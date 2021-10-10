import React, { Component } from 'react';
import { API_URL, API_VERSION } from '../../constants';
import Badge from './Badge';

export default class BadgeList extends Component {
  constructor() {
    super();
    this.state = { badges: [] };
  }

  componentDidMount() {
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/api/${API_VERSION}/wallet/badges`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => this.setState({ badges: data }));
  }
  render() {
    return (
      <div className='badge-container'>
        {this.state.badges.map((badge) => {
          return <Badge badge={badge} key={badge.badgeAddress} />;
        })}
      </div>
    );
  }
}
