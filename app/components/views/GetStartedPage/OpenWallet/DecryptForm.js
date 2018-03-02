import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import "style/GetStarted.less";

const messages = defineMessages({
  publicPassphrasePlaceholder: {
    id: "getStarted.decrypt.publicPassphrasePlaceholder",
    defaultMessage: "Public Passphrase"
  }
});

const OpenWalletDecryptFormBodyBase = ({
  isInputRequest,
  isOpeningWallet,
  publicPassPhrase,
  intl,
  onSetPublicPassPhrase,
  onOpenWallet,
  onKeyDown
}) => (
  isInputRequest &&
  <div className="advanced-page-form">
    <div className="advanced-daemon-row">
      <T id="getStarted.decrypt.info" m="This wallet is encrypted, please enter the public passphrase to decrypt it." />
    </div>
    <div className="advanced-daemon-row">
      <div className="advanced-daemon-label">
        <T id="getStarted.decrypt.label" m="Decrypt Wallet" />
      </div>
      <div className="advanced-daemon-input">
        <PasswordInput
          autoFocus
          className="get-started-input-private-password"
          placeholder={intl.formatMessage(messages.publicPassphrasePlaceholder)}
          value={publicPassPhrase}
          onChange={(e) => onSetPublicPassPhrase(e.target.value)}
          onKeyDown={onKeyDown}/>
      </div>
    </div>
    <div className="loader-bar-buttons">
      <KeyBlueButton
        onClick={onOpenWallet}
        disabled={publicPassPhrase == "" || isOpeningWallet}
        loading={isOpeningWallet}>
        <T id="advancedStartup.skip" m="Open Wallet"/>
      </KeyBlueButton>
    </div>
  </div>
);

export default injectIntl(OpenWalletDecryptFormBodyBase);
