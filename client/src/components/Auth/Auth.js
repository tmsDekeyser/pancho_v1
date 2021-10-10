import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Navigation from '../Navbar';
import Login from './Login';
import Register from './Register';

class Auth extends Component {
  render() {
    return (
      <div>
        {/* <Navigation activeComponent='auth' /> */}
        <div id='transact-form' className='container'>
          <Tabs
            defaultActiveKey='login'
            id='uncontrolled-tab-example'
            className='mb-3'
          >
            <Tab eventKey='login' title='Login'>
              <Login />
            </Tab>
            <Tab eventKey='register' title='Register'>
              <Register />
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Auth;
