import React from 'react';
import { connect } from 'react-redux';
import { checkWalletExist, walletExistRequest } from '../actions/WalletLoaderActions';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

let WalletExistForm = ({ dispatch }) => {
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        dispatch(walletExistRequest());
      }}>
        <RaisedButton type="submit"
         style={style}
         label='Check wallet exists'/>
      </form>
    </div>
  );
};
WalletExistForm = connect()(WalletExistForm);

export default WalletExistForm;
