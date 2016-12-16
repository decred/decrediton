import React from 'react';
import { connect } from 'react-redux';
import { openWalletAttempt } from '../actions/WalletLoaderActions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

let LoaderForm = ({ dispatch }) => {
  let pubpass = '';

  return (
    <div>
      <form id="openWalletForm" onSubmit={e => {
        e.preventDefault();
        if (pubpass == '') {
          return;
        }
        dispatch(openWalletAttempt(pubpass));
        document.getElementById("openWalletForm").reset();
        pubpass.fill(0);
        document.getElementById("pubpass").value = '';
        pubpass = '';
      }}>
        <TextField
          id="pubpass"
          hintText="Public Password"
          floatingLabelText="Public Password"
          onBlur={(e) =>{pubpass = Buffer.from(e.target.value);}}
        /><br />
        <RaisedButton type="submit"
         style={style}
         label='Open Wallet'/>
      </form>
    </div>
  );
};
LoaderForm = connect()(LoaderForm);

export default LoaderForm;
