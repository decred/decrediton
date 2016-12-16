import React from 'react';
import { connect } from 'react-redux';
import { constructTransactionAttempt } from '../actions/ControlActions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

let ConstructTxForm = ({ dispatch }) => {
  let destination = '';
  let amount = '';
  let account = '';
  let confirmations = '';
  return (
    <div>
      <form onSubmit={e => {
	      e.preventDefault();
	      if (destination == '' || amount == '' || account == '' || confirmations == '' ) {
	        return;
	      }
        dispatch(constructTransactionAttempt(account, confirmations, destination, amount));
	    }}>
	      <TextField
          id="destination"
          hintText="Destination Address"
          floatingLabelText="Destination Address"
          onBlur={(e) =>{destination = e.target.value;}}
        /><br />
	      <TextField
          id="amount"
          hintText="Amount"
          floatingLabelText="Amount"
          onBlur={(e) =>{amount = e.target.value;}}
        /><br />
	      <TextField
          id="account"
          hintText="Account Number"
          floatingLabelText="Account Number"
          onBlur={(e) =>{account = e.target.value;}}
        /><br />
	      <TextField
          id="confirmations"
          hintText="# of Confirmations"
          floatingLabelText="# of Confirmations"
          onBlur={(e) =>{confirmations = e.target.value;}}
        /><br />
	      <RaisedButton type="submit"
          style={style}
          label='Send'/>
	    </form>
	</div>);
}
ConstructTxForm = connect()(ConstructTxForm);

export default ConstructTxForm;