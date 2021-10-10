import React from 'react';

const RegularTx = ({ tx }) => {
  const { id, input, outputs } = tx;
  const recipients = Object.keys(outputs);

  return (
    <div>
      <div className='tx-header'>
        Type: {input.type} | ID: {id}{' '}
      </div>
      <div style={{ paddingTop: '5px' }}>
        From: {input.address.substring(0, 19)}... | Balance: {input.balance}{' '}
        SQM:T
      </div>
      <br />
      {recipients.map((recipient) => (
        <div key={recipient}>
          To: {recipient.substring(0, 19)}... | Sent: {outputs[recipient]} SQM:T
        </div>
      ))}
    </div>
  );
};

export default RegularTx;
