import React from 'react';
import { connect } from 'react-redux';
import { getWalletServiceAttempt } from '../actions/ClientActions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

let LoginForm = ({ dispatch }) => {
  let address = '';
  let port = '';
  let passphrase = '';

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        if (address == '' || port == '' || passphrase == '') {
          return;
        }
        dispatch(getWalletServiceAttempt(address, port, passphrase));
        address = '';
        port = '';
      }}>
        <TextField
          id="address"
          hintText="Address"
          floatingLabelText="Address"
          onBlur={(e) =>{address = e.target.value;}}
        /><br />
        <TextField
          id="port"
          hintText="Port"
          floatingLabelText="Port"
          onBlur={(e) =>{port = e.target.value;}}
        /><br />
        <TextField
          id="passphase"
          hintText="Passphrase"
          floatingLabelText="Passphrase"
          onBlur={(e) =>{passphrase = e.target.value;}}
        /><br />
        <RaisedButton type="submit"
         style={style}
         label='Login'/>
      </form>
    </div>
  );
};
LoginForm = connect()(LoginForm);

export default LoginForm;
