import React from 'react';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faHandshake,
  faComments,
} from '@fortawesome/free-solid-svg-icons';

const Badge = ({ badge }) => {
  switch (badge.badgeAddress) {
    case '0xknowledge':
      badge.title = 'Book of Knowledge';
      badge.icon = faBookOpen;
      break;
    case '0xconnector':
      badge.title = 'Connecting People';
      badge.icon = faHandshake;
      break;
    case '0xfeedback':
      badge.title = 'Constructive Feedback';
      badge.icon = faComments;
      break;
  }

  return (
    <div className='contact-card'>
      <Card style={{ width: '12rem' }}>
        <FontAwesomeIcon
          icon={badge.icon}
          style={{
            width: '100%',
            height: '60%',
            padding: '25%',
          }}
        />
        <Card.Body>
          <Card.Title style={{ backgroundColor: 'pink' }}>
            <span style={{ fontSize: '1.2em' }}>{badge.title}</span>
          </Card.Title>
          <Card.Text style={{ fontSize: '0.8em' }}>
            {badge.badgeAddress}
            <br />
            <strong>{badge.amount}</strong> SQM:F
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Badge;
