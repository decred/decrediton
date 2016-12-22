import React from 'react';
import { connect } from 'react-redux';
import { createNewWallet, createWalletRequest } from '../actions/WalletLoaderActions';
import { generateRandomSeedAttempt, decodeSeedAttempt } from '../actions/SeedServiceActions';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Tabs, Tab } from 'material-ui/Tabs';

const style = {
  margin: 12,
};

let CreateWalletForm = ({ dispatch, seedText }) => {
  let pubpass = '';
  let privpass = '';
  let seed = '';
  const newSeed = (
      <form id="newSeed" onSubmit={e => {
        e.preventDefault();
        if (pubpass == '' || privpass == '') {
          return;
        }
        dispatch(createWalletRequest(pubpass, privpass, seedText.getSeedBytes(), false));
        pubpass = '';
        privpass = '';
      }}>
        <TextField
          id="pubpass1"
          hintText="Public Password"
          floatingLabelText="Public Password"
          onBlur={(e) =>{pubpass = e.target.value;}}
        /><br />
        <TextField
          id="privpass1"
          hintText="Private Password"
          floatingLabelText="Private Password"
          onBlur={(e) =>{privpass = e.target.value;}}
        /><br />
        <TextField
          id="seed1"
          multiLine={true}
          rows={11}
          hintText="Seed (33 Words)"
          floatingLabelText="Seed (33 Words)"
          disabled={true}
          value={seedText.getSeedMnemonic()}
          //onBlur={(e) =>{seed = e.target.value;}}
        /><br />
        <RaisedButton type="submit"
         style={style}
         label='Create Wallet'/>
      </form>
  );
  const existingSeed = (
      <form id="existingSeed" onSubmit={e => {
        e.preventDefault();
        if (pubpass == '' || privpass == '' || seed == '') {
          return;
        }
        dispatch(decodeSeedAttempt(pubpass, privpass, seed));
        pubpass = '';
        privpass = '';
        seed = '';
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
        <TextField
          id="seed"
          multiLine={true}
          rows={11}
          hintText="Seed (33 words)"
          floatingLabelText="Seed (33 Words)"
          onBlur={(e) =>{seed = e.target.value;}}
        /><br />
        <RaisedButton type="submit"
         style={style}
         label='Create Wallet'/>
      </form>
  );
  return (
    <div>
      <Tabs>
        <Tab label="New Seed">
          <div>
            {newSeed}
          </div>
        </Tab>
        <Tab label="Existing Seed">
          <div>
            {existingSeed}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};
CreateWalletForm = connect()(CreateWalletForm);

export default CreateWalletForm;
