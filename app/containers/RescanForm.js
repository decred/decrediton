import React from 'react';
import { connect } from 'react-redux';
import { rescanAttempt } from '../actions/ControlActions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

let RescanForm = ({ dispatch }) => {
  let startHeight = '';

  return (
    <div>
      <form id="rescan" onSubmit={e => {
        e.preventDefault();
        if (startHeight == '') {
          return;
        }
        dispatch(rescanAttempt(startHeight));
        document.getElementById('rescan').reset();
        document.getElementById('startHeight').value = '';
        startHeight = '';
      }}>
        <TextField
          id="startHeight"
          hintText="Starting Height for Rescan"
          floatingLabelText="Starting Height for Rescan"
          onBlur={(e) =>{startHeight = e.target.value;}}
        /><br />
        <RaisedButton type="submit"
         style={style}
         label='Rescan Wallet'/>
      </form>
    </div>
  );
};
RescanForm = connect()(RescanForm);

export default RescanForm;
