import React from 'react'
import { connect } from 'react-redux'
import { createNewWallet, createWalletRequest } from '../actions/WalletLoaderActions'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

let CreateWalletForm = ({ dispatch }) => {
  let pubpass = '';
  let privpass = '';
  let seed = '';

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (pubpass == '' || privpass == '' || seed == '') {
          return
        }
        dispatch(createWalletRequest(pubpass, privpass, seed))
        pubpass = ''
        privpass = ''
        seed = ''
      }}>
        <TextField
          id="pubpass"
          hintText="Public Password"
          floatingLabelText="Public Password"
          onBlur={(e) =>{pubpass = e.target.value}}
        /><br />
        <TextField
          id="privpass"
          hintText="Private Password"
          floatingLabelText="Private Password"
          onBlur={(e) =>{privpass = e.target.value}}
        /><br />
        <TextField
          id="seed"
          hintText="Seed"
          floatingLabelText="Seed"
          onBlur={(e) =>{seed = e.target.value}}
        /><br />
        <RaisedButton type="submit"
         style={style} 
         label='Create Wallet'/>
      </form>
    </div>
  )
}
CreateWalletForm = connect()(CreateWalletForm)

export default CreateWalletForm
