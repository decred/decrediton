import React from "react";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import "../../../style/CreateWalletForm.less";

const messages = defineMessages({
  passphrasePlaceholder: {
    id: "createWallet.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  },
  verifyPassphrasePlaceholder: {
    id: "createWallet.verifyPassphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  }
});

const PassPhraseInputs = ({
  passPhraseLabel = <FormattedMessage id="createWallet.passhraseInput.label" defaultMessage="Encrypt Wallet" />,
  passPhraseVerificationLabel = <FormattedMessage id="createWallet.passphraseInput.verifyLabel" defaultMessage="Verify" />,
  blankPassPhraseError = <FormattedMessage id="createWallet.passphraseInput.errors.noPassPhrase" defaultMessage="*Please enter your private passphrase" />,
  passPhraseVerificationError = <FormattedMessage id="createWallet.passphraseInput.errors.noMatch" defaultMessage="*Passwords do not match" />,
  passPhrase,
  passPhraseVerification,
  isBlank,
  isMatching,
  setPassPhrase,
  setPassPhraseVerification,
  intl,
  onKeyDown
}) => (
  <div>
    <div className="content-new-seed-priv-pass">
      <div className="create-wallet-label">{passPhraseLabel}:</div>
      <div className="create-wallet-field">
        <div className="input-form">
          <form className="input-form">
            <input
              className="input-private-password"
              type="password"
              placeholder={intl.formatMessage(messages.passphrasePlaceholder)}
              value={passPhrase}
              onKeyDown={onKeyDown}
              onChange={(e) => setPassPhrase(e.target.value)}
            />
          </form>
        </div>
        {isBlank ? <div className="input-form-error">{blankPassPhraseError}</div> : null}
      </div>
    </div>
    <div className="content-new-seed-priv-pass">
      <div className="create-wallet-label">{passPhraseVerificationLabel}:</div>
      <div className="create-wallet-field">
        <div className="input-form">
          <form className="input-form">
            <input
              className="input-private-password"
              type="password"
              placeholder={intl.formatMessage(messages.verifyPassphrasePlaceholder)}
              value={passPhraseVerification}
              onKeyDown={onKeyDown}
              onChange={(e) => setPassPhraseVerification(e.target.value)}
            />
          </form>
        </div>
        {(!isBlank && !isMatching) ? (
          <div className="input-form-error">{passPhraseVerificationError}</div>
        ) : null}
      </div>
    </div>
  </div>
);

export default injectIntl(PassPhraseInputs);
