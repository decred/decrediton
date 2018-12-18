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
      hasFailedAttempt: false,
      triggerPassphraseModalSubmit: false,
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
    if (privPass == "" ) this.setState({ hasFailedAttempt: true });
    this.setState({ privPass, triggerPassphraseModalSubmit: false });
  }

  updateConfirmPrivatePassphrase(confirmPrivPass) {
    if (confirmPrivPass == "" ) this.setState({ hasFailedAttempt: true });
    this.setState({ confirmPrivPass, confirmPrivPassError: false, triggerPassphraseModalSubmit: false });
  }

  onTriggerPassphraseModalSubmit() {
    this.setState({ triggerPassphraseModalSubmit: true });
  }

  render() {
    const {
      updatePrivatePassphrase,
      updateConfirmPrivatePassphrase,
      onSubmit,
      onCancelModal,
      isValid,
      validationFailed,
      onTriggerPassphraseModalSubmit,
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
          validationFailed,
          onTriggerPassphraseModalSubmit
        }}
      />
    );
  }
}

export default ChangePassphraseModal;
