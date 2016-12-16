import React from 'react';
import { connect } from 'react-redux';
import { openWalletAction, openWalletRequest } from '../actions/WalletLoaderActions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

let LoaderForm = ({ dispatch }) => {
  let pubpass = '';
  let privpass = '';

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        if (pubpass == '' || privpass == '') {
          return;
        }
        dispatch(openWalletRequest(pubpass, privpass));
        pubpass = '';
        privpass = '';
      }}>
        <TextField
          id="pubpass"
          hintText="Public Password"
          floatingLabelText="Public Password"
          onBlur={(e) =>{pubpass = e.target.value;}}
        /><br />
        <TextField
          id="privpass"
          hintText="Private Password"
          floatingLabelText="Private Password"
          onBlur={(e) =>{privpass = e.target.value;}}
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
