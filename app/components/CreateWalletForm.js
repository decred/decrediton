import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ControlActions from '../actions/ControlActions';
import * as WalletLoaderActions from '../actions/WalletLoaderActions';
import * as SeedServiceActions from '../actions/SeedServiceActions';
import Button from '../components/ButtonTanel';
import Formsy from 'formsy-react';
import { FormsyRadio, FormsyRadioGroup, FormsyText } from 'formsy-material-ui/lib';
import ShowError from './ShowError';

class CreateWalletForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canSubmit: false,
    };
  }

  render() {
    let passwordError = 'Passwords do not match';
    let seedError = 'Seed must consist of words';

    const { decodeSeedError, generateRandomSeedError, generateRandomSeedResponse } = this.props;
    const seedDecodeError = (
      <ShowError error={decodeSeedError}/>
    );
    const seedGenerateError = (
      <ShowError error={generateRandomSeedError}/>
    );
    const createWalletForm = (
        <Formsy.Form id="createWalletForm" name="createWalletForm"
          onValid={this.enableButton.bind(this)}
          onInvalid={this.disableButton.bind(this)}
          onValidSubmit={this.submitForm.bind(this)}
          onInvalidSubmit={this.notifyFormError.bind(this)}>
          <FormsyText
            type="password"
            id="pubpass"
            name="pubpass"
            hintText="Public Password"
            floatingLabelText="Public Password"
          /><br />
          <FormsyText
            type="password"
            id="pubpassVerify"
            name="pubpassVerify"
            hintText="Verify Public Password"
            floatingLabelText="Verify Public Password"
            validations="equalsField:pubpass"
            validationError={passwordError}
          /><br />
          <FormsyText
            type="password"
            id="privpass"
            name="privpass"
            hintText="Private Password"
            floatingLabelText="Private Password *"
            required
            validations="isAlphanumeric"
          /><br />
          <FormsyText
            type="password"
            id="privpassVerify"
            name="privpassVerify"
            hintText="Verify Private Password"
            floatingLabelText="Verify Private Password *"
            required
            validations="equalsField:privpass"
            validationError={passwordError}
          /><br />
          <FormsyRadioGroup id="seedtype" name="seedtype" defaultSelected="existing"
            onChange={this.seedTypeChange.bind(this)} style={{ display: 'flex' }}>
            <FormsyRadio
              value="existing"
              label="Existing Seed"
              name="seedtype"
              style={{ width: 'auto' }}
            />
            <FormsyRadio
              value="new"
              label="New Seed"
              name="seedtype"
              style={{ width: 'auto' }}
            />
          </FormsyRadioGroup>
          <FormsyText
            id="seed"
            name="seed"
            multiLine={true}
            rows={11}
            hintText="Seed (33 Words)"
            floatingLabelText="Seed (33 Words) *"
            required
            validations="isWords"
            validationError={seedError}
            value={generateRandomSeedResponse !== null ? generateRandomSeedResponse.getSeedMnemonic() : ''}
          /><br />
          {seedDecodeError}
          {seedGenerateError}
          <Button type="submit">Create Wallet</Button>
        </Formsy.Form>
    );
    return (
      <div>
        {createWalletForm}
      </div>
    );
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }

  seedTypeChange() {
    var form_elements = document.getElementById('createWalletForm').elements;
    var selectedSeedType = form_elements['seedtype'].value;

    switch(selectedSeedType) {
    case 'existing':
      this.props.generateRandomSeedClear();
      break;
    case 'new':
      this.props.generateRandomSeedAttempt();
      break;
    default:
      console.error('seedTypeChange called with undefined type of ' + selectedSeedType);
    }
  }

  submitForm() {
    var form_elements = document.getElementById('createWalletForm').elements;
    var selectedSeedType = form_elements['seedtype'].value;

    var privpass = document.getElementById('privpassVerify').value;
    var pubpass = document.getElementById('pubpassVerify').value;
    var seed = document.getElementById('seed').value;

    switch(selectedSeedType) {
    case 'existing':
    case 'new':
      this.props.decodeSeedAttempt(pubpass, privpass, seed);
      break;
    default:
      console.error('seedTypeChange called with undefined type of ' + selectedSeedType);
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ControlActions, WalletLoaderActions, SeedServiceActions), dispatch);
}

function mapStateToProps(state) {
  return {
    // SeedService
    generateRandomSeedClear: state.seedService.generateRandomSeedClear,
    generateRandomSeedRequestAttempt: state.seedService.generateRandomSeedRequestAttempt,
    generateRandomSeedResponse: state.seedService.generateRandomSeedResponse,
    generateRandomSeedError: state.seedService.generateRandomSeedError,

    decodeSeedRequestAttempt: state.seedService.decodeSeedRequestAttempt,
    decodeSeedResponse: state.seedService.decodeSeedResponse,
    decodeSeedError: state.seedService.decodeSeedError,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWalletForm);
