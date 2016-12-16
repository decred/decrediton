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
      <form id="discoverAddress" onSubmit={e => {
        e.preventDefault();
        if (privpass == '') {
          return;
        }
        dispatch(discoverAddressAttempt(true, privpass));
        document.getElementById('discoverAddress').reset();
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
         label='Discover Addresses'/>
      </form>
    </div>
  );
};
DiscoverAddressForm = connect()(DiscoverAddressForm);

export default DiscoverAddressForm;
