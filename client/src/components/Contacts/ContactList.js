import React from 'react';
import { Address } from '../utils/Address';

export const ContactList = ({ contacts }) => {
  return (
    <div className='margin-bottoms'>
      {Object.values(contacts).map((contact) => {
        return (
          <div className='' key={contact.address}>
            <p className='block-header'>{contact.alias}</p>
            <p className='block-body'>
              Address: <Address address={contact.address} readable={true} />
            </p>
          </div>
        );
      })}
    </div>
  );
};
