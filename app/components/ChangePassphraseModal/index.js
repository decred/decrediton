// @flow
import React from "react";
import { autobind } from "core-decorators";
import Modal from "./Modal";

@autobind
class ChangePassphraseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      privpass: null,
      oldPrivPass: null,
      confirmPrivPass: null,
      privPassError: null,
      oldPrivPassError: null,
      confirmPrivPassError: null
    };
  }

  render() {
    const { hidden, heading, description } = this.props;
    const {
      privpass,
      oldPrivPass,
      confirmPrivPass,
      privPassError,
      oldPrivPassError,
      confirmPrivPassError
    } = this.state;
    const {
      updateOldPrivatePassphrase,
      updatePrivatePassphrase,
      updateConfirmPrivatePassphrase,
      submitPassphrase,
      cancelPassphrase
    } = this;

    return (
      <Modal
        {...{
          hidden,
          heading,
          description,
          privpass,
          oldPrivPass,
          confirmPrivPass,
          privPassError,
          oldPrivPassError,
          confirmPrivPassError,
          updateOldPrivatePassphrase,
          updatePrivatePassphrase,
          updateConfirmPrivatePassphrase,
          submitPassphrase,
          cancelPassphrase
        }}
      />
    );
  }

  resetState() {
    this.state = this.getInitialState(); // clear password data from memory
    document.getElementById("passphrase").value = "";
    document.getElementById("oldPassphrase").value = "";
    document.getElementById("confirmPassphrase").value = "";
  }

  cancelPassphrase() {
    this.resetState();
    this.props.cancelPassphrase();
  }

  submitPassphrase() {
    if (this.state.privpass === null || this.state.privPassError !== null) {
      this.setState({ privPassError: "*Please enter your private passphrase" });
      return;
    }

    if (this.state.oldPrivpass === null || this.state.oldPrivPassError !== null) {
      this.setState({ oldPrivPassError: "*Please enter your old private passphrase" });
      return;
    }

    if (this.state.privpass !== this.state.confirmPrivpass || this.state.confirmPrivPassError !== null) {
      this.setState({ confirmPrivPassError: "*Confirm does not match" });
      return;
    }

    this.props.updatePassphrase(this.state.oldPrivpass, this.state.privpass, true);
    this.resetState();
  }

  updatePrivatePassphrase(privpass) {
    if (privpass !== "") {
      this.setState({ privpass: privpass, privPassError: null });
    } else {
      this.setState({ privpass: null });
    }
  }

  updateOldPrivatePassphrase(privpass) {
    if (privpass !== "") {
      this.setState({ oldPrivpass: privpass, oldPrivPassError: null });
    } else {
      this.setState({ oldPrivpass: null });
    }
  }

  updateConfirmPrivatePassphrase(privpass) {
    if (privpass != "") {
      if (this.state.privpass === privpass) {
        this.setState({ confirmPrivpass: privpass, confirmPrivPassError: null });
      } else {
        this.setState({ confirmPrivPassError: "*Confirm does not match" });
      }
    } else {
      this.setState({ confirmPrivpass: null });
    }
  }
}

export default ChangePassphraseModal;
