import React from 'react';

export const ContactList = ({ contacts }) => {
  return (
    <div>
      {Object.values(contacts).map((contact) => {
        return (
          <div className='' key={contact.address}>
            <p className='block-header'>{contact.alias}</p>
            <p className='block-body'>
              Address: {contact.address.substring(0, 31)}...
            </p>
          </div>
        );
      })}
    </div>
  );
};
