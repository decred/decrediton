import Header from "Header";
import KeyBlueButton from "KeyBlueButton";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import "style/GetStarted.less";

const messages = defineMessages({
  publicPassphrasePlaceholder: {
    id: "getStarted.decrypt.publicPassphrasePlaceholder",
    defaultMessage: "Public Passphrase"
  }
});

const OpenWalletDecryptFormHeader = ({
  startupError
}) => (
  <Header getStarted
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Decrediton" />}
    headerMetaOverview={(
      <div className="get-started-subheader">
        <T id="getStarted.header.openingWallet.meta" m="Opening wallet" />
      </div>
    )}
    headerTop={startupError
      ? <div key="walletOpenError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="walletOpenError" ></div>}
  />
);

const OpenWalletDecryptFormBodyBase = ({
  isInputRequest,
  publicPassPhrase,
  hasAttemptedOpen,
  intl,
  onSetPublicPassPhrase,
  onOpenWallet,
  onKeyDown
}) => (
  isInputRequest ? (
    <div className="get-started-view">
      <div className="get-started-form-ct">
        <div className="get-started-content-instructions">
          <T id="getStarted.decrypt.info" m="This wallet is encrypted, please enter the public passphrase to decrypt it." />
        </div>
        <div className="get-started-field-ct">
          <div className="get-started-label">
            <T id="getStarted.decrypt.label" m="Decrypt Wallet" />
            :</div>
          <div className="get-started-field">
            <form className="get-started-input-form">
              <PasswordInput
                autoFocus
                className="get-started-input-private-password"
                placeholder={intl.formatMessage(messages.publicPassphrasePlaceholder)}
                value={publicPassPhrase}
                onChange={(e) => onSetPublicPassPhrase(e.target.value)}
                onKeyDown={onKeyDown}/>
            </form>
          </div>
          {(hasAttemptedOpen && !publicPassPhrase) ? (
            <div className="get-started-priv-pass-error">
              <T id="getStarted.decrypt.errors.noPublicPassphrase" m="*Please enter your public passphrase" />
            </div>
          ) : null}
          <div className="get-started-field-ct">
            <div className="get-started-label"></div>
            <div className="get-started-field">
              <KeyBlueButton onClick={onOpenWallet}>
                <T id="getStarted.decrypt.openWalletBtn" m="Open Wallet" />
              </KeyBlueButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null
);
const OpenWalletDecryptFormBody = injectIntl(OpenWalletDecryptFormBodyBase);

export { OpenWalletDecryptFormHeader, OpenWalletDecryptFormBody };
