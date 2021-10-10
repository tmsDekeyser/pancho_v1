import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

class Register extends Component {
  constructor() {
    super();
    this.state = { username: '', email: '', password: '', password2: '' };
  }
  updateUsername = (event) => {
    this.setState({ username: event.target.value });
  };

  updateEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  updatePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  updatePassword2 = (event) => {
    this.setState({ password2: event.target.value });
  };

  postRegister = () => {
    const { username, email, password, password2 } = this.state;

    if (password !== password2) {
      alert("Passwords don't match");
      return;
    }

    fetch('http://localhost:3001/api/v0/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.success === true) {
          localStorage.setItem('token', json.token);
          this.setState({ username: '', email: '', password: '' });
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
        <Form>
          <Form.Group className='mb-2' controlId='formRegisterU'>
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type='text'
              placeholder='Username'
              value={this.state.username}
              onChange={this.updateUsername}
            />
          </Form.Group>
          <Form.Group className='mb-2' controlId='formRegisterE'>
            <Form.Label>Register email:</Form.Label>
            <Form.Control
              type='email'
              placeholder='Email'
              value={this.state.email}
              onChange={this.updateEmail}
            />
          </Form.Group>

          <Form.Group className='mb-2' controlId='formRegisterP'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='password'
              value={this.state.password}
              onChange={this.updatePassword}
            />
          </Form.Group>
          <Form.Group className='mb-2' controlId='formRegisterP2'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='password'
              value={this.state.password2}
              onChange={this.updatePassword2}
            />
          </Form.Group>
          <Button variant='dark' onClick={this.postRegister}>
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(Register);
