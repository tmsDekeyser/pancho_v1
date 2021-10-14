import React from 'react';
import { Address } from '../utils/Address';

const DividendTx = ({ tx }) => {
  const { id, input, outputs } = tx;
  const recipients = Object.keys(outputs);

  return (
    <div>
      <div className='tx-header'>
        Type: {input.type} | ID: {id}{' '}
      </div>
      <br />
      {recipients.map((recipient) => (
        <div className='tx-flex-container' key={recipient}>
          <div className='fifty'>
            To: <Address address={recipient} readable={true} />{' '}
          </div>
          <div className='ten'>|</div>
          <div className='thirty'>Sent: {outputs[recipient]} SQM:T</div>
        </div>
      ))}
    </div>
  );
};

export default DividendTx;
