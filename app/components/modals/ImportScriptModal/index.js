import Modal from "./Modal";

@autobind
class ImportScriptModal extends React.Component {

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

  validationFailed() {
    this.setState({ hasFailedAttempt: true });
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
    this.resetState();
  }

  isValid() {
    const { script } = this.state;
    return !!script;
  }

  render() {
    const {
      setScript,
      onSubmit,
      onCancelModal,
      isValid,
      validationFailed
    } = this;

    return (
      <Modal
        {...{ ...this.props, ...this.state }}
        {...{
          setScript,
          onSubmit,
          onCancelModal,
          isValid,
          validationFailed
        }}
      />
    );
  }
}

export default ImportScriptModal;
