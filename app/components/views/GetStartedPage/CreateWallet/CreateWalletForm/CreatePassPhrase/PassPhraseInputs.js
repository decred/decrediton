import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import { InfoDocFieldModalButton } from "buttons";
import "style/CreateWalletForm.less";

const messages = defineMessages({
  passphrasePlaceholder: {
    id: "createWallet.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  },
  verifyPassphrasePlaceholder: {
    id: "createWallet.verifyPassphrasePlaceholder",
    defaultMessage: "Confirm Private Passphrase"
  }
});

const PassPhraseInputs = ({
  passPhraseLabel = <T id="createWallet.passhraseInput.label" m="Private passphrase" />,
  passPhraseVerificationLabel = <T id="createWallet.passphraseInput.verifyLabel" m="Repeat Private Passphrase" />,
  blankPassPhraseError = <T id="createWallet.passphraseInput.errors.noPassPhrase" m="*Please enter your private passphrase" />,
  passPhraseVerificationError = <T id="createWallet.passphraseInput.errors.noMatch" m="*Passphrases do not match" />,
  passPhrase,
  passPhraseVerification,
  isMatching,
  isBlank,
  setPassPhrase,
  setPassPhraseVerification,
  intl,
  onKeyDown,
  hasFailedAttempt
}) => (
  <Aux>
    <div className="confirm-seed-row passphrase">
      <div className="confirm-seed-label-text passphrase">
        <div className="info-label">
          {passPhraseLabel}
        </div>
        <InfoDocFieldModalButton document="PassphraseInfo" />
      </div>
      <div className="create-wallet-field">
        <div className="input-form">
          <form className="input-form">
            <PasswordInput
              required
              className="input-private-password"
              placeholder={intl.formatMessage(messages.passphrasePlaceholder)}
              value={passPhrase}
              onKeyDown={onKeyDown}
              onChange={(e) => setPassPhrase(e.target.value)}
              showErrors={hasFailedAttempt}
              requiredMessage={blankPassPhraseError}
            />
          </form>
        </div>
      </div>
    </div>
    <div className="confirm-seed-row passphrase">
      <div className="confirm-seed-label-text passphrase">{passPhraseVerificationLabel}</div>
      <div className="create-wallet-field">
        <div className="input-form">
          <form className="input-form">
            <PasswordInput
              className="input-private-password"
              invalid={!isBlank && !isMatching}
              invalidMessage={passPhraseVerificationError}
              placeholder={intl.formatMessage(messages.verifyPassphrasePlaceholder)}
              value={passPhraseVerification}
              onKeyDown={onKeyDown}
              onChange={(e) => setPassPhraseVerification(e.target.value)}
              showErrors={true}
            />
          </form>
        </div>
      </div>
    </div>
  </Aux>
);

export default injectIntl(PassPhraseInputs);
