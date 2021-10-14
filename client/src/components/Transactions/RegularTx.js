import React from 'react';
import { Address } from '../utils/Address';

const RegularTx = ({ tx }) => {
  const { id, input, outputs } = tx;
  const recipients = Object.keys(outputs);

  return (
    <div>
      <div className='tx-header'>
        Type: {input.type} | ID: {id}{' '}
      </div>
      <div style={{ paddingTop: '5px' }}>
        From: <Address address={input.address} readable={true} />
        {'   '}|{'   '}
        Balance: {input.balance} SQM:T
      </div>
      <br />
      {recipients.map((recipient) => (
        <div key={recipient}>
          To: <Address address={recipient} readable={true} />
          {'   '}|{'   '}
          Sent: {outputs[recipient]} SQM:T
        </div>
      ))}
    </div>
  );
};

export default RegularTx;
