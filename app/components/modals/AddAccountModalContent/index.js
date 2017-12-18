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

  getInitialState() {
    return {
      name: "",
      passPhrase: "",
      hasFailedAttempt: false
    };
  }

  render() {
    const {
      passPhrase,
      name,
      hasFailedAttempt
    } = this.state;
    const {
      setName,
      setPassPhrase,
      onSubmit
    } = this;

    return (
      <Modal
        {...{
          passPhrase,
          name,
          hasFailedAttempt,
          setName,
          setPassPhrase,
          onSubmit
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

  setName(name) {
    this.setState({ name });
  }

  onSubmit() {
    const { passPhrase, name } = this.state;

    if (!passPhrase || !name) {
      return this.setState({ hasFailedAttempt: true });
    }

    this.props.onSubmit(passPhrase, name);
    this.resetState();
  }
}

export default AddAccountModalContent;
