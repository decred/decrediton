import Modal from "./Modal";

@autobind
class ImportScriptModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      script: "",
      passPhrase: "",
      hasFailedAttempt: false
    };
  }

  render() {
    const {
      passPhrase,
      script,
      hasFailedAttempt
    } = this.state;
    const {
      setScript,
      setPassPhrase,
      onSubmit
    } = this;
    const { onCancelModal } = this.props;

    return (
      <Modal
        {...{
          passPhrase,
          script,
          hasFailedAttempt,
          setScript,
          setPassPhrase,
          onSubmit,
          onCancelModal
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  setPassPhrase(passPhrase) {
    this.setState({ passPhrase });
  }

  setScript(script) {
    this.setState({ script });
  }

  onSubmit() {
    const { passPhrase, script } = this.state;

    if (!passPhrase || !script) {
      return this.setState({ hasFailedAttempt: true });
    }

    this.props.onSubmit(passPhrase, script);
    this.resetState();
  }
}

export default ImportScriptModalContent;
