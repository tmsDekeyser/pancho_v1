import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Jdenticon from '../utils/Jdenticon';
import Transactions from '../Transactions/Transactions';
import Genesis from './Genesis';

class Block extends Component {
  constructor() {
    super();
    this.state = { displayTransactions: false };
  }

  toggleDisplayTransactions = () => {
    this.setState({ displayTransactions: !this.state.displayTransactions });
  };

  get displayTransactions() {
    const { index, data } = this.props.block;
    const isGenesis = index === 0;
    const dataLength = isGenesis ? 0 : data.length;

    if (!this.state.displayTransactions) {
      return (
        <div>
          {/* <div>Miner: {minerAddress}</div> */}
          <div># Transactions: {dataLength}</div>
          <Button
            variant='dark'
            size='sm'
            onClick={this.toggleDisplayTransactions}
            className='custom-but'
          >
            Show Transactions
          </Button>
        </div>
      );
    } else {
      return (
        <div>
          {!isGenesis ? (
            <Transactions key={index} data={data} />
          ) : (
            <Genesis data={data} />
          )}

          <Button
            variant='dark'
            size='sm'
            onClick={this.toggleDisplayTransactions}
            className='custom-but'
          >
            Hide Transactions
          </Button>
        </div>
      );
    }
  }

  render() {
    // console.log(this.props);

    const { index, hash, lastHash, timestamp, nonce, data } = this.props.block;

    const readableHash = `${hash.substring(0, 31)}...`;
    const date = new Date(timestamp).toLocaleString('en-GB');

    return (
      <div>
        <div className='block-header'>
          <div>
            Index: {index}{' '}
            <Jdenticon
              value={`${index}${timestamp}${lastHash}${nonce}${data}`}
              size='128'
            />
          </div>
          <div style={{ width: '500px', wordWrap: 'break-word' }}>
            Timestamp: {date} <br />
            Hash: {hash}
          </div>

          <div>
            Previous:{' '}
            {index === 0 ? (
              <p>None</p>
            ) : (
              <Jdenticon
                value={`${this.props.prevBlock.index}${this.props.prevBlock.timestamp}${this.props.prevBlock.lastHash}${this.props.prevBlock.nonce}${this.props.prevBlock.data}`}
                size='64'
              />
            )}
          </div>
        </div>
        <div className='block-body'>{this.displayTransactions}</div>
      </div>
    );
  }
}

export default Block;
