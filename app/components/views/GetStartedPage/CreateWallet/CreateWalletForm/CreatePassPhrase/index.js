import PassPhraseInputs from "./PassPhraseInputs";

@autobind
class CreatePassPhrase extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      passPhrase: "",
      passPhraseVerification: "",
      isShowingPassphraseInformation: false
    };
  }

  onComponentWillUnmount() {
    this.state = this.getInitialState();
  }

  render() {
    const { setPassPhrase, setPassPhraseVerification, onKeyDown, showPassphraseInformation, hidePassphraseInformation } = this;
    const { passPhrase, passPhraseVerification,isShowingPassphraseInformation } = this.state;
    const isValid = this.isValid();
    const isBlank = this.isBlank();
    const isMatching = this.isMatching();

    return (
      <PassPhraseInputs
        {...{
          ...this.props,
          passPhrase,
          passPhraseVerification,
          isValid,
          isBlank,
          isMatching,
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
  isMatching() {
    return this.state.passPhrase === this.state.passPhraseVerification;
  }

  isBlank() {
    return !this.state.passPhrase;
  }

  isValid() {
    return !this.isBlank() && this.isMatching();
  }

  setPassPhrase(passPhrase) {
    this.setState({ passPhrase }, this.onChange);
  }

  setPassPhraseVerification(passPhraseVerification) {
    this.setState({ passPhraseVerification }, this.onChange);
  }

  onKeyDown(e) {
    if(e.keyCode == 13) {      // Enter key
      e.preventDefault();
      if(this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  onChange() {
    if (this.isValid()) {
      this.props.onChange ? this.props.onChange(this.state.passPhrase) : null;
    } else {
      this.props.onChange ? this.props.onChange("") : null;
    }
  }
}

export default CreatePassPhrase;
