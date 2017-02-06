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

const styles = {
  contentNewSeed: {
    paddingRight: '80px',
    paddingLeft: '80px',
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },
  contentParagraphRight: {
    float: 'left',
    width: '300px',
    marginBottom: '30px',
    color: '#B7D1F0',
    fontSize: '13px',
    lineHeight: '16px',
  },
  contentParagraphLeft: {
    float: 'right',
    width: '300px',
    marginBottom: '30px',
    color: '#B7D1F0',
    fontSize: '13px',
    lineHeight: '16px',
  },
  paragraphCyanBold: {
    color: '#69D5F7',
    fontWeight: '700',
  },
  paragraphCyanRegular: {
    color: '#69D5F7',
  },
  paragraphOrangeWarning: {
    color: '#FD714B',
  },
  contentSeed: {
    width: '100%',
    height: 'auto',
    minHeight: '140px',
    marginBottom: '20px',
    padding: '14px 20px',
    float: 'left',
    border: '1px solid #69D5F7',
    borderRadius: '5px',
    backgroundColor: '#E9F8FE',
    fontFamily: 'Inconsolata,monospace',
    color: '#000',
    fontSize: '16px',
    lineHeight: '29px',
  },
  viewButtonKeyBlueWalletNewSeed: {
    float: 'left',
    display: 'inline-block',
    padding: '17px 18px 18px',
    borderRadius: '5px',
    backgroundColor: '#2971FF',
    boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.2)',
    transitionProperty: 'none',
    color: '#FFF',
    fontSize: '13px',
    lineHeight: '9px',
    fontWeight: '600',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'capitalize',
    transition: 'all 50ms ease-in-out 0s',
  },
  contentNewSeedConfirmSeed: {
    height: '109px',
  },
  contentNewSeedPrivPass: {
    height: '60px',
  },
  contentNewSeedCreateButton: {
    height: '60px',
  },
  contentConfirmWalletCreateInputLeft: {
    width: '160px',
    marginRight: '20px',
    float: 'left',
    color: '#E7EAED',
    fontSize: '19px',
    textAlign: 'right',
    letterSpacing: '-0.1px',
  },
  contentConfirmWalletCreateInputLeftPadding: {
    width: '160px',
    marginRight: '20px',
    float: 'left',
    color: '#E7EAED',
    fontSize: '19px',
    textAlign: 'right',
    letterSpacing: '-0.1px',
    paddingTop: '23px',
  },
  contentConfirmWalletCreateInputRight: {
    width: '540px',
    float: 'left',
    clear: 'right',
  },
  contentConfirmWalletCreateInputRightPadding: {
    marginBottom: '5px',
    width: '300px',
    paddingTop: '11px',
    float: 'left',
    clear: 'right',
  },
  inputPrivatePassword: {
    backgroundColor: 'transparent',
    width: '100%',
    minHeight: '44px',
    paddingRight: '10px',
    paddingLeft: '10px',
    borderStyle: 'none none solid',
    borderBottom: '1px solid #69D5F7',
    color: '#69D5F7',
    fontSize: '19px',
    lineHeight: 'normal',
    font: 'inherit',
    margin: '0px',
    boxSizing: 'border-box',
  },
  inputSeedTextArea: {
    backgroundColor: 'transparent',
    width: '100%',
    minHeight: '108px',
    paddingRight: '10px',
    paddingLeft: '10px',
    borderStyle: 'none none solid',
    borderWidth: '0px 0px 1px',
    borderColor: '#000 #000 #69D5F7',
    fontFamily: 'Inconsolata,monospace',
    color: '#2971FF',
    fontSize: '13px',
    overflow: 'auto',
    font: 'inherit',
    margin: '0px',
  },
  inputForm: {
    mozAppearance: 'none !important',
    position: 'relative',
    width: '100%',
    height: 'auto',
    minHeight: '44px',
  },
}

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

    const newDesign = (
      <div style={styles.contentNewSeed}>
        <div style={styles.contentParagraphRight}>Wallets are determinstically generated by a wallet seed. The seed is a master key to your wallet and entire wallet can be recreate any time using it. If the wallet encryption passphrase is forgotten or the wallet is destroyved, the seed can be used to recover the wallet. <span style={styles.paragraphCyanBold}>Write down the following seed and save it in a secure location.</span>
          <br/>
          <br/><span style={styles.paragraphCyanRegular}>The next prompt will require entering this seed to confirm it has been saved.</span>
        </div>
        <div style={styles.contentParagraphLeft}>To help avoid permanent loss of your wallet,
          <br/>the seed must be backed up before continuing.
          <br/>
          <br/>
          <span style={styles.paragraphOrangeWarning}>Warning:</span> Failure to keep this seed private can result in the theft of your entire wallet. Under no circumstances should this seed ever be revealed to someone else.</div>
        <div style={styles.contentSeed}>{generateRandomSeedResponse !== null ? generateRandomSeedResponse.getSeedMnemonic() : null}</div>
        <a style={styles.viewButtonKeyBlueWalletNewSeed} onClick={()=>{console.log('continue')}}>Continue</a>
      </div>);

    const newContinuedPage = (
      <div style={styles.contentNewSeed}>
        <div style={styles.contentNewSeedConfirmSeed}>
          <div style={styles.contentConfirmWalletCreateInputLeft}>Confirm Seed:&nbsp;</div>
          <div style={styles.contentConfirmWalletCreateInputRight}>
            <div style={styles.inputForm}>
              <form style={styles.inputForm}>
                <textarea style={styles.inputSeedTextArea} type="text" placeholder="33 words"></textarea>
              </form>
            </div>
          </div>
        </div>
        <div style={styles.contentNewSeedPrivPass}>
          <div style={styles.contentConfirmWalletCreateInputLeftPadding}>Encrypt Wallet:</div>
          <div style={styles.contentConfirmWalletCreateInputRightPadding}>
            <div style={styles.inputForm}>
              <form style={styles.inputForm}>
                <input style={styles.inputPrivatePassword} type="password" placeholder="Private Passphrase"/>
              </form>
            </div>
          </div>
        </div>
        <div style={styles.contentNewSeedPrivPass}>
          <div style={styles.contentConfirmWalletCreateInputLeftPadding}>Verify:</div>
          <div cstyle={styles.contentConfirmWalletCreateInputRightPadding}>
            <div style={styles.inputForm}>
              <form style={styles.inputForm}>
                <input style={styles.inputPrivatePassword} type="password" placeholder="Private Passphrase"/>
              </form>
            </div>
          </div>
        </div>
        <div style={styles.contentNewSeedCreateButton}>
          <div style={styles.contentConfirmWalletCreateInputLeftPadding}></div>
          <div style={styles.contentConfirmWalletCreateInputRightPadding}>
            <a style={styles.viewButtonKeyBlueWalletNewSeed} onClick={()=>{console.log("ccreate wallet")}}>Create Wallet</a>
          </div>
        </div>
      </div>);

    return (
      newDesign
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
    // Commenting out pubpass temporarily
    var pubpass = '';//document.getElementById('pubpassVerify').value;
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
