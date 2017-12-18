import Modal from "./Modal";

@autobind
class PassphraseModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      passPhrase: "",
      hasAttemptedSubmit: false
    };
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    const { passPhrase, hasAttemptedSubmit } = this.state;
    const { setPassPhrase, onSubmit } = this;

    return (
      <Modal
        {...{
          passPhrase,
          hasAttemptedSubmit,
          setPassPhrase,
          onSubmit
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSubmit() {
    if (!this.state.passPhrase) {
      return this.setState({ hasAttemptedSubmit: true });
    }

    this.props.onSubmit(this.state.passPhrase);
    this.resetState();
  }

  setPassPhrase(passPhrase) {
    this.setState({ passPhrase });
  }
}

export default PassphraseModalContent;
