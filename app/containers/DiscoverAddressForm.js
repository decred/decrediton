import React from 'react';
import { connect } from 'react-redux';
import { discoverAddressAttempt } from '../actions/WalletLoaderActions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

let DiscoverAddressForm = ({ dispatch }) => {
  let privpass = '';

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        if (privpass == '') {
          return;
        }
        dispatch(discoverAddressAttempt(true, privpass));
        privpass = '';
      }}>
        <TextField
          id="privpass"
          hintText="Private Password"
          floatingLabelText="Private Password"
          onBlur={(e) =>{privpass = e.target.value;}}
        /><br />
        <RaisedButton type="submit"
         style={style}
         label='Discover Addresses'/>
      </form>
    </div>
  );
};
DiscoverAddressForm = connect()(DiscoverAddressForm);

export default DiscoverAddressForm;
