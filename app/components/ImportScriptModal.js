// @flow
import React from 'react';
import Radium from 'radium';
import KeyBlueButton from './KeyBlueButton';
import SlateGrayButton from './SlateGrayButton';

const styles = {
  autoBuyerImportScriptModal: {
    position: 'absolute',
    zIndex: '10',
    overflow: 'auto',
    height: '556px',
    padding: '54px 160px 54px 180px',
    width: '46%',
    backgroundColor: 'rgba(12,30,62, 0.5)'
  },
  importScriptModalSection: {
    padding: '20px',
    backgroundColor: '#fff',
  },
  importScriptModalSectionHeadingSubSection: {
    minHeight: '0px',
    paddingBottom: '10px',
    textTransform: 'none',
    color: '#0c1e3e',
    fontSize: '19px',
    lineHeight: '18px',
    position: 'relative',
    zIndex: '0',
  },
  importScriptModalSectionHeadingSubSectionNotice: {
    color: '#0c1e3e',
    fontSize: '13px',
    lineHeight: '15px',
    position: 'relative',
    zIndex: '0',
  },
  highlightTextNeonGreen: {
    color: '#2ed8a3',
  },
  importScriptModalSubSectionPrivImportScript: {
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
  inputImportScriptField: {
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
  },
  inputError: {
    color: 'red',
    fontSize: '10px',
  }
};
class ImportScriptModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      script: null,
      scriptError: null,
      privpass: null,
      privPassError: null,
    };
  }
  submitImportScript() {
    var checkError = false;
    if (this.state.privpass == null || this.state.privPassError != null) {
      this.setState({privPassError: '*Please enter your private passphrase'});
      checkError = true;
    }
    if (this.state.script == null  || this.state.scriptError != null) {
      this.setState({scriptError: '*Please enter your script'});
      checkError = true;
    }
    if (checkError) {
      return;
    }

    this.props.submitImportScript(this.state.privpass, this.state.script);

    var passPhrase = document.getElementById('passphrase');
    passPhrase.value = '';
    var scriptInput = document.getElementById('script');
    scriptInput.value = '';
    this.setState({script: null, privpass: null});
  }
  cancel() {
    this.setState({script: null, privpass: null, scriptError: null, privPassError: null});
    this.props.cancelImportScript();
  }
  updatePrivatePassphrase(privpass) {
    if (privpass != '') {
      this.setState({privpass: privpass, privPassError: null});
    } else {
      this.setState({privpass: null});
    }
  }
  updateImportScript(script) {
    if (script != '') {
      this.setState({script: script, scriptError: null});
    } else {
      this.setState({script: null});
    }
  }
  render() {
    return (
       <div hidden={this.props.hidden} style={styles.autoBuyerImportScriptModal}>
          <div style={styles.importScriptModalSection}>
            <div style={styles.importScriptModalSectionHeadingSubSection}>{this.props.heading}</div>
            <div style={styles.importScriptModalSectionHeadingSubSectionNotice}>{this.props.description}</div>
            <div style={styles.importScriptModalSubSectionPrivImportScript}>
              <div style={styles.bigPrefix}>Redeem Script:</div>
              <input id='script' style={styles.inputImportScriptField} type="text" placeholder="" defaultValue={this.state.script} onChange={(e) => this.updateImportScript(e.target.value)}/>
              <div style={styles.inputError}>{this.state.scriptError}</div>
            </div>
            <div style={styles.importScriptModalSubSectionPrivImportScript}>
              <div style={styles.bigPrefix}>Private Passphrase:</div>
              <input id='passphrase' style={styles.inputImportScriptField} type="password" placeholder="" defaultValue={this.state.privpass} onChange={(e) => this.updatePrivatePassphrase(e.target.value)}/>
              <div style={styles.inputError}>{this.state.privPassError}</div>
            </div>
            <div style={styles.modalSubSectionSaveCancel}>
              <KeyBlueButton style={{float: 'left'}} onClick={()=>this.submitImportScript()}>save</KeyBlueButton>
              <SlateGrayButton style={{float: 'right'}} onClick={()=>this.cancel()}>cancel</SlateGrayButton>
            </div>
          </div>
        </div>
    );

  }
}

export default Radium(ImportScriptModal);