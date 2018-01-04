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

  validationFailed() {
    if (!this.state.privpass) {
      this.setState({ privPassError: "*Please enter your private passphrase" });
    } else if (this.state.privpass !== this.state.confirmPrivpass) {
      this.setState({ confirmPrivPassError: "*Confirm does not match" });
    }
  }

  isValid() {
    return (
      !!this.state.privpass &&
      this.state.privpass === this.state.confirmPrivpass
    );
  }

  onSubmit(passPhrase) {
    this.props.onSubmit(passPhrase, this.state.privpass, true);
  }

  updatePrivatePassphrase(privpass) {
    if (privpass !== "") {
      this.setState({ privpass: privpass, privPassError: null });
    } else {
      this.setState({ privpass: null, privPassError: "*Please enter your private passphrase" });
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

  render() {
    const {
      updatePrivatePassphrase,
      updateConfirmPrivatePassphrase,
      onSubmit,
      isValid,
      validationFailed
    } = this;

    return (
      <Modal
        {...{...this.props, ...this.state}}
        {...{
          updatePrivatePassphrase,
          updateConfirmPrivatePassphrase,
          onSubmit,
          isValid,
          validationFailed
        }}
      />
    );
  }
}

export default ChangePassphraseModalContent;
