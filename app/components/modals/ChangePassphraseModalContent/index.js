import Modal from "./Modal";

@autobind
class ChangePassphraseModalContent extends React.Component {
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
      onSubmit
    } = this;
    const { onCancelModal } = this.props;

    return (
      <Modal
        {...{
          privpass,
          oldPrivPass,
          confirmPrivPass,
          privPassError,
          oldPrivPassError,
          confirmPrivPassError,
          updateOldPrivatePassphrase,
          updatePrivatePassphrase,
          updateConfirmPrivatePassphrase,
          onSubmit,
          onCancelModal
        }}
      />
    );
  }

  resetState() {
    this.state = this.getInitialState(); // clear password data from memory
  }

  onSubmit() {
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

    this.props.onSubmit(this.state.oldPrivpass, this.state.privpass, true);
    this.resetState();
  }

  updatePrivatePassphrase(privpass) {
    if (privpass !== "") {
      this.setState({ privpass: privpass, privPassError: null });
    } else {
      this.setState({ privpass: null, privPassError: "*Please enter your private passphrase" });
    }
  }

  updateOldPrivatePassphrase(privpass) {
    if (privpass !== "") {
      this.setState({ oldPrivpass: privpass, oldPrivPassError: null });
    } else {
      this.setState({ oldPrivpass: null, oldPrivPassError: "*Please enter your old private passphrase" });
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

export default ChangePassphraseModalContent;
