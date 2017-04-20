import React from 'react';
import Radium from 'radium';
import { StakePoolStyles } from './views/ViewStyles';
import KeyBlueButton from './KeyBlueButton';
import SlateGrayButton from './SlateGrayButton';

const styles = {
  autoBuyerPassphraseModal: {
    position: 'absolute',
    zIndex: '10',
    overflow: 'auto',
    height: '556px',
    padding: '54px 160px 54px 180px',
  },
  autobuyerPassphraseModalSection: {
    padding: '20px',
    backgroundColor: '#fff',
  },
  autobuyerPassphraseModalSectionHeadingSubSection: {
    minHeight: '0px',
    paddingBottom: '10px',
    textTransform: 'none',
    color: '#0c1e3e',
    fontSize: '19px',
    lineHeight: '18px',
    position: 'relative',
    zIndex: '0',
  },
  autobuyerPassphraseModalSectionHeadingSubSectionNotice: {
    color: '#0c1e3e',
    fontSize: '13px',
    lineHeight: '15px',
    position: 'relative',
    zIndex: '0',
  },
  highlightTextNeonGreen: {
    color: '#2ed8a3',
  },
  autobuyerPassphraseModalSubSectionPrivPassphrase: {
    marginBottom: '3px',
    paddingTop: '11px',
    paddingRight: '10px',
    position: 'relative',
    zIndex: '0',
    minHeight: '50px',
  },
  bigPrefix: {
    paddingRight: '10px',
    float: 'left',
    color: '#0c1e3e',
    fontSize: '19px',
    height: '100%',
    paddingTop: '5px',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  inputPassphraseField: {
    width: '290px',
    padding: '7px 10px',
    float: 'left',
    borderStyle: 'solid',
    borderWidth: '0px 0px 1px',
    borderColor: '#000 #000 #a9b4bf',
    color: '#0c1e3e',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '2px',
    margin: '0',
  },
  modalSubSectionSaveCancel: {
    height: '44px',
  }
}
class PassphraseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privpass: null,
      privPassError: null,
    }
  }
  submitPassphrase() {
    if (this.state.privpass == null || this.state.privPassError != null) {
      this.setState({privPassError: '*Please enter your private passphrase'});
      return;
    }
    this.props.submitPassphrase(this.state.privpass);
    var passPhrase = document.getElementById('passphrase');
    passPhrase.value = '';
    this.setState({privpass: null});
  }
  updatePrivatePassphrase(privpass) {
    if (privpass != '') {
      this.setState({privpass: privpass, privPassError: null});
    } else {
      this.setState({privpass: null});
    }
  }
  render() {
    return (
       <div hidden={this.props.hidden} style={styles.autoBuyerPassphraseModal}>
          <div style={styles.autobuyerPassphraseModalSection}>
            <div style={styles.autobuyerPassphraseModalSectionHeadingSubSection}>{this.props.heading}</div>
            <div style={styles.autobuyerPassphraseModalSectionHeadingSubSectionNotice}>{this.props.description}</div>
            <div style={styles.autobuyerPassphraseModalSubSectionPrivPassphrase}>
              <div style={styles.bigPrefix}>Private Passphrase:</div>
              <input id='passphrase' style={styles.inputPassphraseField} type="password" placeholder="" defaultValue={this.state.privpass} onChange={(e) => this.updatePrivatePassphrase(e.target.value)}/>
            </div>
            <div style={styles.modalSubSectionSaveCancel}>
              <KeyBlueButton style={{float: 'left'}} onClick={()=>this.submitPassphrase()}>save</KeyBlueButton>
              <SlateGrayButton style={{float: 'right'}} onClick={()=>this.props.cancelPassphrase()}>cancel</SlateGrayButton>
            </div>
          </div>
        </div>
    );

  }
}

export default Radium(PassphraseModal);