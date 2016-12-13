import React from 'react'
import { connect } from 'react-redux'
import { openWalletAction, openWalletRequest } from '../actions/WalletLoaderActions'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

let LoaderForm = ({ dispatch }) => {
  let pubpass, privpass

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!pubpass.value.trim() || !pubpass.value.trim()) {
          return
        }
        dispatch(openWalletRequest(pubpass.value, privpass.value))
        pubpass.value = ''
        privpass.value = ''
      }}>
        <TextField
          id="pubpass"
          hintText="Public Password"
          floatingLabelText="Public Password"
        /><br />
        <TextField
          id="privpass"
          hintText="Private Password"
          floatingLabelText="Private Password"
        /><br />
        <RaisedButton type="submit"
         style={style}>
          Open Wallet
        </RaisedButton>
      </form>
    </div>
  )
}
LoaderForm = connect()(LoaderForm)

export default LoaderForm
