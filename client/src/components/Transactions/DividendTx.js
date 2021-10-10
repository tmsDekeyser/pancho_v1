import React from 'react';

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
        <div key={recipient}>
          To: {recipient.substring(0, 19)}... | Sent: {outputs[recipient]} SQM:T
        </div>
      ))}
    </div>
  );
};

export default DividendTx;
