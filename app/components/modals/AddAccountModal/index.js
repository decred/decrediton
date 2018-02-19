import Modal from "./Modal";

@autobind
class AddAccountModal extends React.Component {
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
      name: "",
      hasFailedAttempt: false
    };
  }

  setName(name) {
    this.setState({ name });
  }

  onSubmit(passPhrase) {
    const { name } = this.state;
    this.props.onSubmit(passPhrase, name);
    this.resetState();
  }

  isValid() {
    const { name } = this.state;
    return !!name;
  }

  render() {
    const {
      setName,
      onSubmit,
      onCancelModal,
      isValid,
      validationFailed
    } = this;

    return (
      <Modal
        {...{ ...this.props, ...this.state }}
        {...{
          setName,
          onSubmit,
          onCancelModal,
          isValid,
          validationFailed
        }}
      />
    );
  }
}

export default AddAccountModal;
