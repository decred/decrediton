import React from 'react';
import { connect } from 'react-redux';
import { loaderRequest } from '../actions/WalletLoaderActions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

let LoaderForm = ({ dispatch }) => {
  let address = '';
  let port = '';

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        if (address == '' || port == '') {
          return;
        }
        dispatch(loaderRequest(address, port));
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
        <RaisedButton type="submit"
         style={style}
         label='Get Loader'/>
      </form>
    </div>
  );
};
LoaderForm = connect()(LoaderForm);

export default LoaderForm;
