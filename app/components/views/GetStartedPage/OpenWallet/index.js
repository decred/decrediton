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
    };
  }

  render() {
    const { openWalletInputRequest, isOpeningWallet } = this.props;
    if (!openWalletInputRequest) return null;

    const { publicPassPhrase } = this.state;
    const {
      onSetPublicPassPhrase,
      onOpenWallet,
      onKeyDown
    } = this;

    return (
      <OpenWalletDecryptFormBody
        {...{
          ...this.props,
          isOpeningWallet,
          publicPassPhrase,
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
    if (this.state.publicPassPhrase == "") {
      return;
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
