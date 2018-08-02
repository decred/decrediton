import {
  SpvSyncFormHeader as SpvSyncHeader,
  SpvSyncFormBody
} from "./Form";

@autobind
class SpvSyncBody extends React.Component {
  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.resetState();
  }

  componentDidMount() {
    if (this.props.walletPrivatePassphrase && this.props.fetchHeadersDone !== null) {
      this.props.onSpvSynces(this.props.walletPrivatePassphrase);
    }
  }

  getInitialState() {
    return {
      passPhrase: "",
      hasAttemptedDiscover: false
    };
  }

  render() {
    const { passPhrase, hasAttemptedDiscover } = this.state;
    const { onSetPassPhrase, onSpvSync, onKeyDown } = this;

    return (
      <SpvSyncFormBody
        {...{
          ...this.props,
          passPhrase,
          hasAttemptedDiscover,
          onSetPassPhrase,
          onSpvSync,
          onKeyDown
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSetPassPhrase(passPhrase) {
    this.setState({ passPhrase });
  }

  onSpvSync() {
    const { passPhrase } = this.state;

    if (!passPhrase) {
      return this.setState({ hasAttemptedDiscover: true });
    }

    const { startSPVSync, onSetWalletPrivatePassphrase } = this.props;

    onSetWalletPrivatePassphrase && onSetWalletPrivatePassphrase(passPhrase);
    startSPVSync(passPhrase);
    this.resetState();
  }

  onKeyDown(e) {
    if(e.keyCode == 13) {   // Enter key
      e.preventDefault();
      this.onSpvSync();
    }
  }

}

export { SpvSyncHeader, SpvSyncBody };
