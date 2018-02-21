import { OpenWalletDecryptFormBody } from "./DecryptForm";
import OpenWalletCreateForm from "./CreateForm";

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
    console.log(this.props.existingOrNew);
    const { publicPassPhrase, hasAttemptedOpen, onKeyDown } = this.state;
    const { hasExistingWallet } = this.props;
    const {
      onSetPublicPassPhrase,
      onOpenWallet
    } = this;

    return (
      <div className="page-body getstarted">
        {hasExistingWallet ?
          <OpenWalletDecryptFormBody
            {...{
              ...this.props,
              publicPassPhrase,
              hasAttemptedOpen,
              onSetPublicPassPhrase,
              onOpenWallet,
              onKeyDown
            }}
          /> :
          <OpenWalletCreateForm
            {...{
              ...this.props
            }}
          />
        }
      </div>);
  }

  onToggleNewExisting(side) {
    if (side == "right") {
      this.props.onSetCreateWalletFromExisting(true);
    } else if (side == "left") {
      this.props.onSetCreateWalletFromExisting(false);
    }
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
    if(e.keyCode == 13) {     // Enter key
      e.preventDefault();
      this.onOpenWallet();
    }
  }

}

export default OpenWallet;
