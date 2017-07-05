// @flow
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  decodeSeedAttempt,
  generateRandomSeedAttempt,
  generateRandomSeedClear,
} from '../actions/SeedServiceActions';
import {
  createWalletRequest,
  createWalletConfirmNewSeed,
  createWalletGoBackNewSeed,
} from '../actions/WalletLoaderActions';

import KeyBlueButton from './KeyBlueButton';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import ConfimSeed from './SeedEntry';

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
  },
  contentNewSeedConfirmSeed: {
    height: '200px',
  },
  contentNewSeedPrivPass: {
    paddingTop: '10px',
    height: '80px',
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
    margin: '0px',
  },
  inputForm: {
    MozAppearance: 'none !important',
    position: 'relative',
    width: '100%',
    height: 'auto',
    minHeight: '44px',
  },
  inputFormConfirmSeed: {
    MozAppearance: 'none !important',
    position: 'relative',
    width: '100%',
    height: '200px',
    minHeight: '44px',
  },
  inputFormError: {
    color: 'red',
  }
};

class CreateWalletForm extends React.Component {
  constructor(props) {
    super(props);
    var requiredSeedLength = 33;
    this.state = {
      canSubmit: false,
      continued: false,
      seedMnemonicHex: '',
      privpass: '',
      seedError: null,
      verifyError: '',
      privPassError: null,
      remainingSeedWords: requiredSeedLength,
      requiredSeedLength: requiredSeedLength,
    };
  }
  componentWillUpdate(nextProps) {
    if (this.props.decodeSeedError !== nextProps.decodeSeedError) {
      this.setState({seedError: nextProps.decodeSeedError});
    }
  }
  render() {
    const { generateRandomSeedResponse } = this.props;
    const newDesign = (
      <div style={styles.contentNewSeed}>
        <div style={styles.contentParagraphRight}>Wallets are determinstically generated by a wallet seed. The seed is a master key of your wallet and the entire wallet can be recreated at any time using it. If the wallet encryption passphrase is forgotten or the wallet is destroyed, the seed can be used to recover the wallet. <span style={styles.paragraphCyanBold}>Write down the following seed and save it in a secure location.</span>
          <br/>
          <br/><span style={styles.paragraphCyanRegular}>The next prompt will require entering this seed to confirm it has been saved.</span>
        </div>
        <div style={styles.contentParagraphLeft}>To help avoid permanent loss of your wallet,
          <br/>the seed must be backed up before continuing.
          <br/>
          <br/>
          <span style={styles.paragraphOrangeWarning}>Warning:</span> Failure to keep this seed private can result in the theft of your entire wallet. Under no circumstances should this seed ever be revealed to someone else.</div>
        <div style={styles.contentSeed}>{generateRandomSeedResponse !== null ? generateRandomSeedResponse.getSeedMnemonic() : null}</div>
        <KeyBlueButton style={styles.viewButtonKeyBlueWalletNewSeed} onClick={()=>this.props.createWalletConfirmNewSeed()}>Continue</KeyBlueButton>
      </div>);

    const newContinuedPage = (
      <div style={styles.contentNewSeed}>
        <div style={styles.contentNewSeedConfirmSeed}>
          <div style={styles.contentConfirmWalletCreateInputLeft}>Confirm Seed:&nbsp;</div>
          <div style={styles.contentConfirmWalletCreateInputRight}>
            <div style={styles.inputForm}>
              <form style={styles.inputFormConfirmSeed}>
                <ConfimSeed label="Seed Entry" checkSeedMatch={(seed)=>this.checkSeedMatch(seed)}/>
              </form>
            </div>
            <div style={styles.inputFormError}>
              {this.state.seedError !== null ? this.state.seedError : ''}
            </div>
          </div>
        </div>
        <div style={styles.contentNewSeedPrivPass}>
          <div style={styles.contentConfirmWalletCreateInputLeftPadding}>Encrypt Wallet:</div>
          <div style={styles.contentConfirmWalletCreateInputRightPadding}>
            <div style={styles.inputForm}>
              <form style={styles.inputForm}>
                <input
                  style={styles.inputPrivatePassword}
                  type="password"
                  placeholder="Private Passphrase"
                  onBlur={(e)=>this.updatePrivPass(e.target.value)}/>
              </form>
            </div>
            <div style={styles.inputFormError}>
              {this.state.privPassError}
            </div>
          </div>
        </div>
        <div style={styles.contentNewSeedPrivPass}>
          <div style={styles.contentConfirmWalletCreateInputLeftPadding}>Verify:</div>
          <div style={styles.contentConfirmWalletCreateInputRightPadding}>
            <div style={styles.inputForm}>
              <form style={styles.inputForm}>
                <input
                  style={styles.inputPrivatePassword}
                  type="password"
                  placeholder="Private Passphrase"
                  onBlur={(e)=>this.verifyPrivatePassword(e.target.value)}/>
              </form>
            </div>
            <div style={styles.inputFormError}>
              {this.state.verifyError !== '' ? this.state.verifyError : ''}
            </div>
          </div>
        </div>
        <div style={styles.contentNewSeedCreateButton}>
          <span style={{color:'white'}}> Seed words remaining: {this.state.remainingSeedWords} </span>
          <div style={styles.contentConfirmWalletCreateInputLeftPadding}></div>
          <div style={styles.contentConfirmWalletCreateInputRightPadding}>
            <KeyBlueButton style={styles.viewButtonKeyBlueWalletNewSeed} disabled={this.state.verifyError !== '' || this.state.seedError !== null ||
              this.state.privpass == '' || (this.state.seed == '' && this.props.decodeSeedResponse === null)} onClick={this.state.verifyError !== '' || this.state.seedError !== null ||
              this.state.privpass == '' || (this.state.seed == '' && this.props.decodeSeedResponse === null) ? null : ()=>this.createWalletButton()}>Create Wallet</KeyBlueButton>
          </div>
        </div>
      </div>);

    if (this.props.confirmNewSeed || this.props.createWalletExisting) {
      return (newContinuedPage);
    } else {
      return (newDesign);
    }
  }
  checkSeedMatch(seedConfirmation) {
    if (seedConfirmation.length < this.state.requiredSeedLength) {
      this.setState({remainingSeedWords:this.state.requiredSeedLength - seedConfirmation.length});
      return;
    }
    this.setState({remainingSeedWords:0});
    var seedConfirmationStr = "";
    for (var i = 0; i < seedConfirmation.length; i++) {
      seedConfirmationStr += seedConfirmation[i].name;
      if (i < seedConfirmation.length - 1) {
        seedConfirmationStr += " ";
      }
    }
    if (this.props.createWalletExisting) {
      this.props.decodeSeedAttempt(seedConfirmationStr);
    } else {
      if (seedConfirmationStr !== '' && this.props.generateRandomSeedResponse.getSeedMnemonic() != seedConfirmationStr) {
        this.setState({seedError:'*Seeds do not match'});
      } else {
        this.setState({seedError: null, seed: this.props.generateRandomSeedResponse.getSeedBytes()});
      }
    }
  }
  createWalletButton() {
    if (this.state.privpass == '') {
      this.setState({privPassError: '*Please enter your private passphrase'});
      return;
    }
    if (this.state.verifyError !== '' || this.state.seedError !== null ||
      this.state.privpass == '' || (this.state.seed == '' && this.props.decodeSeedResponse === null)) {
      return;
    }
    if (this.props.createWalletExisting && this.props.decodeSeedResponse === null) {
      return;
    }
    if (this.state.privPassError !== null) {
      return;
    }
    if (this.props.createWalletExisting) {
      this.props.createWalletRequest(this.state.pubpass, this.state.privpass, this.props.decodeSeedResponse.getDecodedSeed(), true);
    } else {
      this.props.createWalletRequest(this.state.pubpass, this.state.privpass, this.state.seed, false);
    }
  }
  updatePrivPass(privPass) {
    if (privPass !== '') {
      this.setState({privpass: privPass, privPassError: null});
    } else {
      this.setState({privPassError: '*Please enter your private passphrase'});
    }
  }
  verifyPrivatePassword(verifyPrivPass) {
    if (this.state.privpass != '' && this.state.privpass != verifyPrivPass) {
      this.setState({verifyError:'*Passwords do not match'});
    } else {
      this.setState({verifyError:''});
    }
  }
  continueToConfirmButton() {
    this.props.createWalletConfirmNewSeed();
  }
  goBackToNewSeedButton() {
    this.props.createWalletGoBackNewSeed();
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
  return bindActionCreators({
    createWalletConfirmNewSeed,
    createWalletGoBackNewSeed,
    decodeSeedAttempt,
    createWalletRequest,
    generateRandomSeedClear,
    generateRandomSeedAttempt}, dispatch);
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
    createWalletExisting: state.walletLoader.createWalletExisting,
    confirmNewSeed: state.walletLoader.confirmNewSeed,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWalletForm);
