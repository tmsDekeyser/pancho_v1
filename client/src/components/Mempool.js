import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Nomination from './Transactions/Nomination';
import Navigation from './Navbar';
import RegularTx from './Transactions/RegularTx';
import BadgeTx from './Transactions/BadgeTx';

const POLL_INTERVAL_MS = 12000;

class Mempool extends Component {
  constructor() {
    super();
    this.state = { transactions: [], nominations: [], badgeTransactions: [] };
  }

  componentDidMount() {
    this.fetchMempoolData();

    this.fetchInterval = setInterval(this.fetchMempoolData, POLL_INTERVAL_MS);
  }

  componentWillUnmount() {
    clearInterval(this.fetchInterval);
  }

  fetchMempoolData = () => {
    fetch('http://localhost:3001/api/v0/p2p/mempool')
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          transactions: data.transactions,
          nominations: data.nominations,
          badgeTransactions: data.badgeTransactions,
        })
      );
  };

  displayTransactions() {
    if (
      this.state.transactions.length !== 0 ||
      this.state.badgeTransactions.length !== 0
    ) {
      return (
        <div>
          <div>
            {this.state.transactions.map((tx) => {
              return (
                <div>
                  <RegularTx key={tx.id} tx={tx} />
                  <hr />
                </div>
              );
            })}
          </div>
          <div style={{ paddingBottom: '5px' }}>
            {this.state.badgeTransactions.map((tx) => {
              return (
                <div>
                  <BadgeTx key={tx.id} tx={tx} />
                  <hr />
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return <div>No transactions pending</div>;
    }
  }

  displayNominations() {
    if (this.state.nominations.length !== 0) {
      return (
        <div>
          {this.state.nominations.map((nom) => {
            return (
              <div>
                <Nomination
                  key={nom.id}
                  nom={nom}
                  nominations={this.state.nominations}
                />
                <hr />
              </div>
            );
          })}
        </div>
      );
    } else {
      return <div style={{ padding: '1% 0' }}>No nominations pending</div>;
    }
  }

  mineBlock = () => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/api/v0/p2p/mine`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        alert('Succes, block mined!');
        this.props.history.push('/blocks');
      } else {
        alert('Something went wrong');
      }
    });
  };

  render() {
    const activeComponent = 'mempool';

    return (
      <div>
        <Navigation activeComponent={activeComponent} />
        <div className='Blocks container'>
          <div className='block-header' style={{ marginTop: '30px' }}>
            <div>Nominations Pool</div>
          </div>
          <div className='block-body'>{this.displayNominations()}</div>
        </div>
        <hr />
        <Button variant='dark' onClick={this.mineBlock}>
          Mine a Block
        </Button>
        <hr />
        <div className='Blocks container'>
          <div className='block-header'>
            <div>Transactions Pool</div>
          </div>
          <div className='block-body'>{this.displayTransactions()}</div>
        </div>
      </div>
    );
  }
}

export default Mempool;
