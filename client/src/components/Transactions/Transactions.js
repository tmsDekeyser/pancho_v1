import React from 'react';
import RegularTx from './RegularTx';
import RewardTx from './RewardTx';
import DividendTx from './DividendTx';
import BadgeTx from './BadgeTx';

const Transactions = ({ data }) => {
  return (
    <div>
      {data.map((tx) => {
        switch (tx.input.type) {
          case 'REGULAR':
            return (
              <div key={tx.id}>
                <RegularTx tx={tx} />
                <hr></hr>
              </div>
            );
          case 'REWARD':
            return (
              <div key={tx.id}>
                <RewardTx tx={tx} />
                <hr></hr>
              </div>
            );
          case 'DIVIDEND':
            return (
              <div key={tx.id}>
                <DividendTx tx={tx} />
                <hr></hr>
              </div>
            );
          case 'BADGE':
            return (
              <div key={tx.id}>
                <BadgeTx tx={tx} />
                <hr></hr>
              </div>
            );
          default:
            console.log('default case');
            return (
              <div key={tx.id}>
                <p>Here come the transactions</p>
              </div>
            );
        }
      })}
    </div>
  );
};

export default Transactions;
