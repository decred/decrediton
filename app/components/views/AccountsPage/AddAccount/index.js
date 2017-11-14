import AddAccountForm from "./Form";
import { accountsPageAddAccount } from "connectors";

@autobind
class AddAccount extends React.Component {
  constructor(props)  { super(props); }
  state = this.getInitialState();

  getInitialState() {
    return {
      name: "",
      passPhrase: "",
      hasAttemptedSave: false
    };
  }

  componentWillUnmount() { this.resetState(); }

  render() {
    return (
      <AddAccountForm
        {...{
          name: this.state.name,
          passPhrase: this.state.passPhrase,
          hasAttemptedSave: this.state.hasAttemptedSave,
          setName: this.setName,
          setPassPhrase: this.setPassPhrase,
          onSave: this.onSave,
          onCancel: this.onCancel,
          routes: this.props.routes
        }}
      />
    );
  }

  resetState()              { this.setState(this.getInitialState()); }
  setName(name)             { this.setState({ name }); }
  setPassPhrase(passPhrase) { this.setState({ passPhrase }); }

  onSave() {
    const { name, passPhrase } = this.state;

    if (!name || !passPhrase) {
      return this.setState({ hasAttemptedSave: true });
    }

    this.props.onGetNextAccountAttempt(Buffer.from(passPhrase), name);
    this.props.onAction();
    this.resetState();
  }

  onCancel() {
    this.props.onAction();
    this.resetState();
  }
}

export default accountsPageAddAccount(AddAccount);
