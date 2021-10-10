import React from 'react';

const BadgeTx = ({ tx }) => {
  const { id, input, outputs, nomination } = tx;
  const recipients = Object.keys(outputs);

  return (
    <div>
      <div className='tx-header'>
        Type: {input.type} | ID: {id}{' '}
      </div>
      <div style={{ paddingTop: '5px' }}>
        Nominator: {input.address.substring(0, 19)}... <br /> Nominee:{' '}
        {nomination.data.address.substring(0, 19)}... <br />
        Badge: {nomination.data.badge.badgeAddress}
      </div>
      <br />
      {recipients.map((recipient) => (
        <div key={recipient}>
          From: {recipient.substring(0, 19)}... | Sent: {outputs[recipient]}{' '}
          SQM:F
        </div>
      ))}
    </div>
  );
};

export default BadgeTx;
