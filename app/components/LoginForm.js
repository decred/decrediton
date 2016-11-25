import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Field, Form, Errors, actions, Control } from 'react-redux-form/immutable';

import SubmitButton from './SubmitButton';
import { client } from '../actions/client';

const isRequired = (val) => val && val.length > 0;
const lessThan10 = (val) => {
  const lessThan = 10;
  if (!(val < 10)) {
    return { lessThan };
  }
  return false;
};
const defaultPort = "19112";
const defaultAddress = "127.0.0.1";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    console.log(props);
    console.log(this.props);
    this.props = props;
  }

  handleSubmit(user) {  // user is an Immutable Map
    const { dispatch } = this.props;

    // Do whatever you like in here.
    // You can use actions such as:
    // dispatch(actions.submit('user', somePromise));
    // etc.
    const somePromise = new Promise((resolve) => {
      /* eslint-disable no-console */
      console.log("login attempt", user.toJS());
      /* eslint-enable no-console */
      user.client = client(user.toJS().address, user.toJS().port);
      if (user.client !== null) {
        this.props.logIn(true);
        this.props.setGrpcClient(user.client);
      }
      setTimeout(() => { resolve(true); }, 1000);
    });
    dispatch(actions.submit('user', somePromise));
  }

  render() {
    if (this.props.isLoggedIn) {
      return (
        <div></div>
      );
    }
    return (
      <Form
        model="user"
        onSubmit={this.handleSubmit}
      >
        <label>Address: </label>
        <Control.text
          model="user.address"
          validators={{ isRequired }}
          />
          <Errors
            wrapper="span"
            show={{ touched: true, focus: false }}
            model=".address"
            messages={{
              isRequired: 'Please provide your dcrwallet address.',
            }}
          />
        <br/>
        <label>Port: </label>
        <Control.text 
          model="user.port"
          validators={{ isRequired }}
        />
        <Errors
          wrapper="span"
          show={{ touched: true, focus: false }}
          model=".port"
          messages={{
            isRequired: 'Please provide your dcrwallet port.',
          }}
        />
        <br/>
        <label>Passphrase: </label>
        <Control.text
          model="user.passphrase"
          validators={{ isRequired }}
          />
        <Errors
          wrapper="span"
          show={{ touched: true, focus: false }}
          model=".passphrase"
          messages={{
            isRequired: 'Please provide your dcrwallet passphrase.',
          }}
        />
        <br/>

        <SubmitButton />
      </Form>
    );
  }
}

LoginForm.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isLoggedIn: React.PropTypes.bool.isRequired,
  logIn: React.PropTypes.func.isRequired,
  setGrpcClient: React.PropTypes.func.isRequired,
  //grpcClient: React.PropTypes.object.isRequired,
};

export default connect()(LoginForm);
