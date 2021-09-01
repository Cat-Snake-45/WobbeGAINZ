import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// React element to render login form and submit login to server
const Login = ({ setUserInfo }) => {
  const [formVals, setFormVals] = useState({ email: '', password: '' });
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Helper function to update state formVals on form change
  const updateFormVal = (key, val) => {
    setFormVals({ ...formVals, [key]: val });
  };

  // Function to submit signup form data to server, create new account
  const login = () => {
    console.log('logging in!', formVals);

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formVals),
    })
      .then((response) => {
        // If login successful, set state for redirect
        console.log('LOGIN RESPONSE: ', response.status);
        if (response.status === 201 || response.status === 400) {
          return response.json();
        }
        throw new Error('Error when trying to login a user!');
      }).then((data) => {
        // If Error on Login display error message
        if (data.message) {
          setErrorMessage(data.message);
          return;
        }
        // Successful login, redirect to main page:
        setUserInfo(data);
        setLoggedIn(true);
      })
      .catch((err) => console.error(err));
  };

  const { email, password } = formVals;

  // If signed up correctly, redirect to main page
  if (loggedIn) {
    return <Redirect to="/" />;
  }

  // If not logged in render login form
  if (!loggedIn) {
    return (
      <section>
      <h1>Login to WobbeGainz:</h1>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}>
          <Form.Group className="emailInput" controlId="email">
            <Form.Label> Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => {
                console.log('Updated state: ', e.target.value);
                updateFormVal('email', e.target.value);
              }} />
            <Form.Text className="text-muted">
              Your email is only used for gainz -- nothing else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="passwordInput" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => {
                console.log('Updated state: ', e.target.value);
                updateFormVal('password', e.target.value);
              }}
              value={password}
              required />
          </Form.Group>

          <Button
            variant="primary"
            type="submit">
            Submit
          </Button>
        </Form>
        {errorMessage ? (
        <p>
          Error:
          {` ${errorMessage}`}
        </p>
      )
        : null}
      <p>
      No Account?
      <Link className="link" to="/signup">
        Sign Up
      </Link>
    </p>
      </section>
    );
  }
};

export default Login;