import Modal from "./Modal";

@autobind
class ChangePassphraseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  onCancelModal() {
    this.resetState();
    this.props.onCancelModal && this.props.onCancelModal();
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  getInitialState() {
    return {
      privPass: "",
      confirmPrivPass: "",
      confirmPrivPassError: false,
      hasFailedAttempt: false
    };
  }

  validationFailed() {
    const privPassError = !this.state.privPass;
    const hasFailedAttempt = true;
    const confirmPrivPassError = this.state.privPass !== this.state.confirmPrivPass;
    this.setState({ privPassError, hasFailedAttempt, confirmPrivPassError });
  }

  isValid() {
    return (
      !!this.state.privPass &&
      this.state.privPass === this.state.confirmPrivPass
    );
  }

  onSubmit(passPhrase) {
    this.props.onSubmit(passPhrase, this.state.privPass, true);
    this.resetState();
  }

  updatePrivatePassphrase(privPass) {
    this.setState({ privPass });
  }

  updateConfirmPrivatePassphrase(confirmPrivPass) {
    this.setState({ confirmPrivPass, confirmPrivPassError: false });
  }

  render() {
    const {
      updatePrivatePassphrase,
      updateConfirmPrivatePassphrase,
      onSubmit,
      onCancelModal,
      isValid,
      validationFailed
    } = this;

    return (
      <Modal
        {...{ ...this.props, ...this.state }}
        {...{
          updatePrivatePassphrase,
          updateConfirmPrivatePassphrase,
          onSubmit,
          onCancelModal,
          isValid,
          validationFailed
        }}
      />
    );
  }
}

export default ChangePassphraseModal;
