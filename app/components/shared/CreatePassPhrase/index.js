import PassPhraseInputs from "./PassPhraseInputs";

@autobind
class CreatePassPhrase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passPhrase: "",
      passPhraseVerification: "",
      isShowingPassphraseInformation: false,
      hasFailedAttempt: false
    };
  }

  render() {
    const {
      setPassPhrase,
      setPassPhraseVerification,
      onKeyDown,
      showPassphraseInformation,
      hidePassphraseInformation
    } = this;
    const {
      passPhrase,
      passPhraseVerification,
      isShowingPassphraseInformation,
      hasFailedAttempt
    } = this.state;
    const isValid = this.isValid();
    return (
      <PassPhraseInputs
        {...{
          ...this.props,
          hasFailedAttempt,
          passPhrase,
          passPhraseVerification,
          isValid,
          setPassPhrase,
          setPassPhraseVerification,
          onKeyDown,
          showPassphraseInformation,
          hidePassphraseInformation,
          isShowingPassphraseInformation
        }}
      />
    );
  }
  showPassphraseInformation() {
    this.setState({ isShowingPassphraseInformation: true });
  }
  hidePassphraseInformation() {
    this.setState({ isShowingPassphraseInformation: false });
  }

  isValid() {
    return (
      !!this.state.passPhrase &&
      this.state.passPhrase === this.state.passPhraseVerification
    );
  }

  setPassPhrase(passPhrase) {
    this.setState({ hasFailedAttempt: true });
    this.setState({ passPhrase }, this.onChange);
  }

  setPassPhraseVerification(passPhraseVerification) {
    this.setState({ passPhraseVerification }, this.onChange);
  }

  onKeyDown(e) {
    if (e.keyCode == 13) {
      // Enter key
      e.preventDefault();
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  onChange() {
    if (this.isValid()) {
      this.props.onChange(this.state.passPhrase);
    } else {
      this.props.onChange("");
    }
  }
}

CreatePassPhrase.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default CreatePassPhrase;
