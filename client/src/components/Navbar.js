import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navigation = ({ activeComponent }) => {
  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand href='#home'>Pancho demo</Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link
              href='/'
              className={activeComponent === 'wallet' ? 'activeNavLink' : ''}
            >
              Wallet
            </Nav.Link>
            <Nav.Link
              href='/contacts'
              className={activeComponent === 'contacts' ? 'activeNavLink' : ''}
            >
              Contacts
            </Nav.Link>
            <Nav.Link
              href='/transact'
              className={activeComponent === 'transact' ? 'activeNavLink' : ''}
            >
              Transact
            </Nav.Link>
            <Nav.Link
              href='/blocks'
              className={activeComponent === 'blocks' ? 'activeNavLink' : ''}
            >
              Blocks
            </Nav.Link>

            <Nav.Link
              href='/mempool'
              className={activeComponent === 'mempool' ? 'activeNavLink' : ''}
            >
              Mempool
            </Nav.Link>

            <Nav.Link
              href='/'
              className='logout'
              onClick={() => localStorage.removeItem('token')}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
