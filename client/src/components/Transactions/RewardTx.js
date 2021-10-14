import React from 'react';
import { Address } from '../utils/Address';

const RewardTx = ({ tx }) => {
  const { id, input, outputs } = tx;
  const recipients = Object.keys(outputs);

  return (
    <div>
      <div className='tx-header'>
        Type: {input.type} | ID: {id}{' '}
      </div>

      {recipients.map((recipient) => (
        <div style={{ paddingTop: '5px' }} key={recipient}>
          To: <Address address={recipient} readable={true} /> | Sent:{' '}
          {outputs[recipient]} SQM:T
        </div>
      ))}
    </div>
  );
};

export default RewardTx;
