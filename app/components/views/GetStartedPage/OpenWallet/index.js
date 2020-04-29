import OpenWalletDecryptFormBody from "./DecryptForm";
import { FormattedMessage as T } from "react-intl";
import { substruct } from "fp";
import { OPENWALLET_FAILED_INPUT } from "actions/WalletLoaderActions";

@autobind
class OpenWallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      publicPassPhrase: ""
    };
  }

  render() {
    const { publicPassPhrase } = this.state;

    return (
      <OpenWalletDecryptFormBody
        {...{
          ...this.props,
          // isOpeningWallet,
          publicPassPhrase,
          ...substruct(
            {
              onSetPublicPassPhrase: null,
              onOpenWallet: null,
              onKeyDown: null
            },
            this
          )
        }}
      />
    );
  }

  onSetPublicPassPhrase(publicPassPhrase) {
    this.setState({ publicPassPhrase });
  }

  onOpenWallet() {
    if (this.state.publicPassPhrase == "") {
      return;
    }

    this.props
      .onOpenWallet(this.state.publicPassPhrase, true)
      .then(() => this.props.onSendContinue())
      .catch((error) => {
        if (error === OPENWALLET_FAILED_INPUT) {
          return this.props.onSendError(
            <T
              id="getStarted.decrypt.error"
              m="Wrong public passphrase inserted."
            />
          );
        }
        this.props.onSendError(error);
      });
    this.setState({ publicPassPhrase: "" });
  }

  onKeyDown(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      this.onOpenWallet();
    }
  }
}

export default OpenWallet;
