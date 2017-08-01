// @flow
import React from "react";
import Radium from "radium";
import KeyBlueButton from "./KeyBlueButton";
import SlateGrayButton from "./SlateGrayButton";

const styles = {
  autoBuyerPassphraseModal: {
    position: "absolute",
    zIndex: "10",
    overflow: "auto",
    height: "556px",
    padding: "54px 160px 54px 180px",
    width: "46%",
    backgroundColor: "rgba(12,30,62, 0.5)"
  },
  autobuyerPassphraseModalSection: {
    padding: "20px",
    backgroundColor: "#fff",
  },
  autobuyerPassphraseModalSectionHeadingSubSection: {
    minHeight: "0px",
    paddingBottom: "10px",
    textTransform: "none",
    color: "#0c1e3e",
    fontSize: "19px",
    lineHeight: "18px",
    position: "relative",
    zIndex: "0",
  },
  autobuyerPassphraseModalSectionHeadingSubSectionNotice: {
    color: "#0c1e3e",
    fontSize: "13px",
    lineHeight: "15px",
    position: "relative",
    zIndex: "0",
  },
  highlightTextNeonGreen: {
    color: "#2ed8a3",
  },
  autobuyerPassphraseModalSubSectionPrivPassphrase: {
    marginBottom: "3px",
    paddingTop: "11px",
    paddingRight: "10px",
    position: "relative",
    zIndex: "0",
    minHeight: "50px",
  },
  bigPrefix: {
    float: "left",
    color: "#0c1e3e",
    fontSize: "19px",
    height: "100%",
    width: "200px",
    paddingTop: "5px",
    paddingRight: "10px",
    textAlign: "right",
    textTransform: "capitalize",
  },
  inputPassphraseField: {
    width: "260px",
    padding: "7px 10px",
    float: "left",
    borderStyle: "solid",
    borderWidth: "0px 0px 1px",
    borderColor: "#000 #000 #a9b4bf",
    color: "#0c1e3e",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "2px",
    margin: "0",
  },
  modalSubSectionSaveCancel: {
    height: "44px",
  },
  inputError: {
    textAlign: "right",
    color: "red",
    fontSize: "10px",
  }
};
class ChangePassphraseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privpass: null,
      oldPrivPass: null,
      confirmPrivPass: null,
      privPassError: null,
    };
  }
  submitPassphrase() {
    var checkError = false;
    if (this.state.privpass == null || this.state.privPassError != null) {
      this.setState({privPassError: "*Please enter your private passphrase"});
      checkError = true;
    }
    if (this.state.oldPrivpass == null || this.state.oldPrivPassError != null) {
      this.setState({oldPrivPassError: "*Please enter your old private passphrase"});
      checkError = true;
    }
    if (this.state.privpass != this.state.confirmPrivpass || this.state.confirmPrivPassError != null) {
      this.setState({confirmPrivPassError: "*Confirm does not match"});
      checkError = true;
    }
    if (checkError) {
      return;
    }
    this.props.updatePassphrase(this.state.oldPrivpass, this.state.privpass, true);
    var passPhrase = document.getElementById("passphrase");
    passPhrase.value = "";
    var oldPassPhrase = document.getElementById("oldPassphrase");
    oldPassPhrase.value = "";
    var confirmPassPhrase = document.getElementById("confirmPassphrase");
    confirmPassPhrase.value = "";
    this.setState({privpass: null, oldPrivpass: null, confirmPrivpass: null});
  }
  updatePrivatePassphrase(privpass) {
    if (privpass != "") {
      this.setState({privpass: privpass, privPassError: null});
    } else {
      this.setState({privpass: null});
    }
  }
  updateOldPrivatePassphrase(privpass) {
    if (privpass != "") {
      this.setState({oldPrivpass: privpass, oldPrivPassError: null});
    } else {
      this.setState({oldPrivpass: null});
    }
  }
  updateConfirmPrivatePassphrase(privpass) {
    if (privpass != "") {
      if (this.state.privpass == privpass) {
        this.setState({confirmPrivpass: privpass, confirmPrivPassError: null});
      } else {
        this.setState({confirmPrivPassError: "*Confirm does not match"});
      }
    } else {
      this.setState({confirmPrivpass: null});
    }
  }
  render() {
    return (
       <div hidden={this.props.hidden} style={styles.autoBuyerPassphraseModal}>
          <div style={styles.autobuyerPassphraseModalSection}>
            <div style={styles.autobuyerPassphraseModalSectionHeadingSubSection}>{this.props.heading}</div>
            <div style={styles.autobuyerPassphraseModalSectionHeadingSubSectionNotice}>{this.props.description}</div>
            <div style={styles.autobuyerPassphraseModalSubSectionPrivPassphrase}>
              <div style={styles.bigPrefix}>Old Private Passphrase:</div>
              <input id='oldPassphrase' style={styles.inputPassphraseField} type="password" placeholder="" defaultValue={this.state.oldPrivpass} onChange={(e) => this.updateOldPrivatePassphrase(e.target.value)}/>
              <div style={styles.inputError}>{this.state.oldPrivPassError}</div>
            </div>
            <div style={styles.autobuyerPassphraseModalSubSectionPrivPassphrase}>
              <div style={styles.bigPrefix}>New Private Passphrase:</div>
              <input id='passphrase' style={styles.inputPassphraseField} type="password" placeholder="" defaultValue={this.state.privpass} onChange={(e) => this.updatePrivatePassphrase(e.target.value)}/>
              <div style={styles.inputError}>{this.state.privPassError}</div>
            </div>
            <div style={styles.autobuyerPassphraseModalSubSectionPrivPassphrase}>
              <div style={styles.bigPrefix}>Confirm:</div>
              <input id='confirmPassphrase' style={styles.inputPassphraseField} type="password" placeholder="" defaultValue={this.state.confirmPrivpass} onChange={(e) => this.updateConfirmPrivatePassphrase(e.target.value)}/>
              <div style={styles.inputError}>{this.state.confirmPrivPassError}</div>
            </div>
            <div style={styles.modalSubSectionSaveCancel}>
              <KeyBlueButton style={{float: "left"}} onClick={()=>this.submitPassphrase()}>Update</KeyBlueButton>
              <SlateGrayButton style={{float: "right"}} onClick={()=>this.props.cancelPassphrase()}>cancel</SlateGrayButton>
            </div>
          </div>
        </div>
    );

  }
}

export default Radium(ChangePassphraseModal);