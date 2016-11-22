// @flow
import React from 'react';
import { Control, Form, actions } from 'react-redux-form';

class LoginForm extends React.Component {
  handleSubmit(user) {
    const { dispatch } = this.props;

    // Do whatever you like in here.
    // You can use actions such as:
    // dispatch(actions.submit('user', somePromise));
    // etc.
  }
  render() {
    return (
      <Form model="user"
        onSubmit={(user) => this.handleSubmit(user)}>
        <label>address</label>
        <Control.text model="user.address" />

        <label>port</label>
        <Control.text model="user.port" />

        <label>passphrase</label>
        <Control.text model="user.passphrase" />
        <button type="submit">
          Connect to wallet
        </button>
      </Form>
    );
  }
}

export default LoginForm;