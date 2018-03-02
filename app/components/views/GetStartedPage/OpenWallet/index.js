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
    const { publicPassPhrase, onKeyDown } = this.state;
    const {
      onSetPublicPassPhrase,
      onOpenWallet,
    } = this;
    const { isInputRequest, isOpeningWallet } = this.props;
    return (
      <OpenWalletDecryptFormBody
        {...{
          ...this.props,

          isInputRequest,
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
