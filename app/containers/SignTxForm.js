import React from 'react';
import { connect } from 'react-redux';
import { signTransactionAttempt } from '../actions/ControlActions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

let ConstructTxForm = ({ dispatch, rawTx }) => {
  let privpass = '';

  return (
    <div>
      <form id="signTxForm" onSubmit={e => {
        e.preventDefault();
        if (privpass == '') {
          return;
        }
        dispatch(signTransactionAttempt(privpass, rawTx));
        document.getElementById('signTxForm').reset();
        privpass.fill(0);
        document.getElementById('privpass').value = '';
        privpass = '';
      }}>
        <TextField
          id="privpass"
          hintText="Private Password"
          floatingLabelText="Private Password"
          onBlur={(e) =>{privpass = Buffer.from(e.target.value);}}
        /><br />
        <RaisedButton type="submit"
         style={style}
         label='Confirm and Sign Tx'/>
      </form>
	</div>);
};
ConstructTxForm = connect()(ConstructTxForm);

export default ConstructTxForm;
