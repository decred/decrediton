import Modal from "./Modal";

@autobind
class PassphraseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
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
      passPhrase: "",
      hasFailedAttempt: false
    };
  }

  setPassPhrase(passPhrase) {
    if (passPhrase == "") this.setState({ hasFailedAttempt: true });

    this.setState({ passPhrase });
  }

  isValid() {
    const { passPhrase } = this.state;
    const parentValid = this.props.isValid ? this.props.isValid() : true;
    return !!passPhrase && parentValid;
  }

  onSubmit() {
    const { passPhrase } = this.state;

    if (!this.isValid()) {
      this.props.validationFailed && this.props.validationFailed();
      return this.setState({ hasFailedAttempt: true });
    }

    this.props.onSubmit(passPhrase);
    this.resetState();
  }

  render() {
    const { setPassPhrase, onSubmit, onCancelModal } = this;
    const { hasFailedAttempt } = this.state;
    return (
      <Modal
        {...{
          ...this.props,
          ...this.state,
          setPassPhrase,
          onSubmit,
          onCancelModal,
          hasFailedAttempt
        }}
      />
    );
  }
}

export default PassphraseModal;
