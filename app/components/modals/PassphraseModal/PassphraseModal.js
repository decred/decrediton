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

  getInitialState() {
    const parentState = this.props.getInitialState ? this.props.getInitialState() : {};
    return {
      passPhrase: "",
      hasFailedAttempt: false,
      ...parentState
    };
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  setPassPhrase(passPhrase) {
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
  }

  render() {
    const { setPassPhrase, onSubmit } = this;

    return (
      <Modal
        {...{
          ...this.props,
          ...this.state,
          setPassPhrase,
          onSubmit
        }}
      />
    );
  }
}

export default PassphraseModal;
