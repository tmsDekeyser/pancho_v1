import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { API_URL, API_VERSION } from '../../constants';

class Login extends Component {
  constructor() {
    super();
    this.state = { email: '', password: '' };
  }

  updateEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  updatePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  postLogin = () => {
    const { email, password } = this.state;

    fetch(`${API_URL}/api/${API_VERSION}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success === true) {
          localStorage.setItem('token', json.token);
          this.setState({ email: '', password: '' });
          this.props.history.push('/');
        } else {
          alert(json.error);
        }
      })
      .catch((err) => console.error(err));
  };

  render() {
    return (
      <div>
        {/* How do I enable submitting via Enter key? */}
        <Form onSubmit={this.postLogin}>
          <Form.Group className='mb-2' controlId='formLogin'>
            <Form.Label>Email login:</Form.Label>
            <Form.Control
              type='email'
              placeholder='Email'
              value={this.state.email}
              onChange={this.updateEmail}
            />
          </Form.Group>

          <Form.Group className='mb-2' controlId='formLogin2'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='password'
              value={this.state.password}
              onChange={this.updatePassword}
            />
          </Form.Group>
          <Button variant='dark' onClick={this.postLogin}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(Login);
