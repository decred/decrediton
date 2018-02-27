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
  publicPassPhrase,
  hasAttemptedOpen,
  intl,
  onSetPublicPassPhrase,
  onOpenWallet,
  onKeyDown
}) => (
  isInputRequest &&
    <Aux>
      <div className="get-started-field-ct">
        <div className="get-started-label">
          <T id="getStarted.decrypt.label" m="Decrypt Wallet" />
        </div>
        <div className="get-started-field">
          <PasswordInput
            autoFocus
            className="get-started-input-private-password"
            placeholder={intl.formatMessage(messages.publicPassphrasePlaceholder)}
            value={publicPassPhrase}
            onChange={(e) => onSetPublicPassPhrase(e.target.value)}
            onKeyDown={onKeyDown}/>
        </div>
        {(hasAttemptedOpen && !publicPassPhrase) ? (
          <div className="get-started-priv-pass-error">
            <T id="getStarted.decrypt.errors.noPublicPassphrase" m="*Please enter your public passphrase" />
          </div>
        ) : null}
      </div>
      <div className="get-started-field-ct">
        <div className="get-started-field">
          <KeyBlueButton onClick={onOpenWallet}>
            <T id="getStarted.decrypt.openWalletBtn" m="Open Wallet" />
          </KeyBlueButton>
        </div>
      </div>
    </Aux>
);

export default injectIntl(OpenWalletDecryptFormBodyBase);
