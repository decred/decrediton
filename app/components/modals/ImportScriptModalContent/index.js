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

  validationFailed() {
    this.setState({hasFailedAttempt: true});
  }

  getInitialState() {
    return {
      script: "",
      hasFailedAttempt: false
    };
  }

  setScript(script) {
    this.setState({ script });
  }

  onSubmit(passPhrase) {
    const { script } = this.state;
    this.props.onSubmit(passPhrase, script);
  }

  isValid() {
    const { script } = this.state;
    return !!script;
  }

  render() {
    const {
      setScript,
      onSubmit,
      isValid,
      validationFailed
    } = this;

    return (
      <Modal
        {...{...this.props, ...this.state}}
        {...{
          setScript,
          onSubmit,
          isValid,
          validationFailed
        }}
      />
    );
  }
}

export default ImportScriptModalContent;
