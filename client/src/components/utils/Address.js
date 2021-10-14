import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';

export const Address = ({ address, readable }) => {
  return (
    <span>
      {readable ? `${address.substring(0, 19)}...` : `${address} `}
      <CopyToClipboard
        text={address}
        // onCopy={() => alert('Copied to Clipboard')}
      >
        <Button variant='light' size='sm'>
          <FontAwesomeIcon icon={faClipboard} />
        </Button>
      </CopyToClipboard>
    </span>
  );
};
