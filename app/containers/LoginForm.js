import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Field, Form, Errors, actions } from 'react-redux-form/immutable';

import SubmitButton from './SubmitButton';
import { client, getBalance } from '../actions/client';

const isRequired = (val) => val && val.length > 0;
const lessThan10 = (val) => {
  const lessThan = 10;
  if (!(val < 10)) {
    return { lessThan };
  }
  return false;
};

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(user) {  // user is an Immutable Map
    const { dispatch, logIn } = this.props;

    // Do whatever you like in here.
    // You can use actions such as:
    // dispatch(actions.submit('user', somePromise));
    // etc.
    const somePromise = new Promise((resolve) => {
      /* eslint-disable no-console */
      console.log(user.toJS());
      /* eslint-enable no-console */
      user.client = client(user.toJS().address, user.toJS().port);
      
      logIn(true);
      getBalance(user.client);
      setTimeout(() => { resolve(true); }, 1000);
    });
    dispatch(actions.submit('user', somePromise));
  }

  render() {
    return (
      <Form
        model="user"
        onSubmit={this.handleSubmit}
      >
        <Field model="user.address" validators={{ isRequired }}>
          <label>Address: </label>
          <input type="text" />
          <Errors
            wrapper="span"
            show={{ touched: true, focus: false }}
            model="user.address"
            messages={{
              isRequired: 'Please provide a dcrwallet address.',
            }}
          />
        </Field>

        <Field model="user.port" validators={{ isRequired }}>
          <label>Port: </label>
          <input type="text" />
          <Errors
            wrapper="span"
            show={{ touched: true, focus: false }}
            model="user.port"
            messages={{
              isRequired: 'Please provide a dcrwallet port.',
            }}
          />
        </Field>

        <Field model="user.passphrase" validators={{ isRequired }}>
          <label>Passphrase: </label>
          <input type="password" />
          <Errors
            wrapper="span"
            show={{ touched: true, focus: false }}
            model="user.passphrase"
            messages={{
              isRequired: 'Please provide a dcrwallet passphrase.',
            }}
          />
        </Field>

        <SubmitButton />
      </Form>
    );
  }
}

LoginForm.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
};

export default connect()(LoginForm);