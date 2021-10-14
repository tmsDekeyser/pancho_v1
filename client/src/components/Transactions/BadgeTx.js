import React from 'react';
import { Address } from '../utils/Address';

const BadgeTx = ({ tx }) => {
  const { id, input, outputs, nomination } = tx;
  const recipients = Object.keys(outputs);

  return (
    <div>
      <div className='tx-header'>
        Type: {input.type} | ID: {id}{' '}
      </div>
      <div style={{ paddingTop: '5px' }}>
        Nominator: <Address address={nomination.data.address} readable={true} />{' '}
        <br />
        Nominee: <Address address={input.address} readable={true} /> <br />
        Badge: <Address address={nomination.data.badge.badgeAddress} />
      </div>
      <br />
      {recipients.map((recipient) => (
        <div key={recipient}>
          From: <Address address={recipient} readable={true} /> | Sent:{' '}
          {outputs[recipient]} SQM:F
        </div>
      ))}
    </div>
  );
};

export default BadgeTx;
