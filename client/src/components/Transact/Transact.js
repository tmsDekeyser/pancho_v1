import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Navigation from '../Navbar';
import ConductTransaction from './ConductTransaction';
import ConductNomination from './ConductNomination';
import { API_VERSION, NO_AUTH } from '../../constants';

class Transact extends Component {
  state = { isAuthenticated: true, badges: [] };

  componentDidMount() {
    const token = localStorage.getItem('token');

    if (!token && !NO_AUTH) {
      this.setState({ isAuthenticated: false });
    } else {
      fetch(`api/${API_VERSION}/p2p/blocks`)
        .then((res) => res.json())
        .then((data) => this.setState({ badges: Object.values(data[0].data) }));
    }
  }

  // componentDidUpdate() {
  //   const token = localStorage.getItem('token');

  //   if (token && !this.state.isAuthenticated) {
  //     this.setState({ isAuthenticated: true });
  //   }
  // }

  render() {
    if (this.state.isAuthenticated) {
      return (
        <div>
          <Navigation activeComponent='transact' />
          <div id='transact-form' className='container'>
            <Tabs
              defaultActiveKey='transaction'
              id='uncontrolled-tab-example'
              className='mb-3'
            >
              <Tab eventKey='transaction' title='Transaction'>
                <ConductTransaction history={this.props.history} />
              </Tab>
              <Tab eventKey='nomination' title='Nomination'>
                <ConductNomination
                  badges={this.state.badges}
                  history={this.props.history}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Redirect to='/' />
        </div>
      );
    }
  }
}

export default Transact;
