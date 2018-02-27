import OpenWalletDecryptFormBody from "./DecryptForm";

@autobind
class OpenWallet extends React.Component {
  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.resetState();
  }

  getInitialState() {
    return {
      publicPassPhrase: "",
      hasAttemptedOpen: false
    };
  }

  render() {
    const { publicPassPhrase, hasAttemptedOpen, onKeyDown } = this.state;
    const {
      onSetPublicPassPhrase,
      onOpenWallet
    } = this;
    const { isInputRequest } = this.props;
    console.log(isInputRequest);
    return (
      <OpenWalletDecryptFormBody
        {...{
          ...this.props,
          isInputRequest,
          publicPassPhrase,
          hasAttemptedOpen,
          onSetPublicPassPhrase,
          onOpenWallet,
          onKeyDown
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSetPublicPassPhrase(publicPassPhrase) {
    this.setState({ publicPassPhrase });
  }

  onOpenWallet() {
    if (!this.state.publicPassPhrase) {
      return this.setState({ hasAttemptedOpen: true });
    }

    this.props.onOpenWallet(this.state.publicPassPhrase, true);
    this.resetState();
  }

  onKeyDown(e) {
    if(e.keyCode == 13) {
      e.preventDefault();
      this.onOpenWallet();
    }
  }

}

export default OpenWallet;
