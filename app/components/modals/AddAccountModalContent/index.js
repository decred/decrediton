import Modal from "./Modal";

@autobind
class AddAccountModalContent extends React.Component {
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
  }

  isValid() {
    const { name } = this.state;
    return !!name;
  }

  render() {
    const {
      setName,
      onSubmit,
      isValid,
      validationFailed
    } = this;

    return (
      <Modal
        {...{...this.props, ...this.state}}
        {...{
          setName,
          onSubmit,
          isValid,
          validationFailed
        }}
      />
    );
  }
}

export default AddAccountModalContent;
