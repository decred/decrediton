import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import { InfoModalButton } from "buttons";
import { PassphraseInfoModalContent } from "modals";
import "style/CreateWalletForm.less";

const messages = defineMessages({
  passphrasePlaceholder: {
    id: "createWallet.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  },
  verifyPassphrasePlaceholder: {
    id: "createWallet.verifyPassphrasePlaceholder",
    defaultMessage: "Confirm"
  }
});

const PassPhraseInputs = ({
  passPhraseLabel = <T id="createWallet.passhraseInput.label" m="Private passphrase" />,
  passPhraseVerificationLabel = <T id="createWallet.passphraseInput.verifyLabel" m="Confirm" />,
  blankPassPhraseError = <T id="createWallet.passphraseInput.errors.noPassPhrase" m="*Please enter your private passphrase" />,
  passPhraseVerificationError = <T id="createWallet.passphraseInput.errors.noMatch" m="*Passwords do not match" />,
  passPhrase,
  passPhraseVerification,
  isBlank,
  isMatching,
  setPassPhrase,
  setPassPhraseVerification,
  intl,
  onKeyDown
}) => (
  <Aux>
    <div className="confirm-seed-row passphrase">
      <div className="confirm-seed-label-text passphrase">
        <InfoModalButton
          modalTitle={<h1><T id="confirmSeed.passphraseInformation" m="Private passphrase information" /></h1>}
          modalContent={<PassphraseInfoModalContent />}
        />
        {passPhraseLabel}
      </div>
      <div className="create-wallet-field">
        <div className="input-form">
          <form className="input-form">
            <PasswordInput
              className="input-private-password"
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
    <div className="confirm-seed-row passphrase">
      <div className="confirm-seed-label-text passphrase">{passPhraseVerificationLabel}</div>
      <div className="create-wallet-field">
        <div className="input-form">
          <form className="input-form">
            <PasswordInput
              className="input-private-password"
              placeholder={intl.formatMessage(messages.verifyPassphrasePlaceholder)}
              value={passPhraseVerification}
              onKeyDown={onKeyDown}
              onChange={(e) => setPassPhraseVerification(e.target.value)}
            />
          </form>
        </div>
        {(!isBlank && !isMatching) && <div className="input-form-error">{passPhraseVerificationError}</div>}
      </div>
    </div>
  </Aux>
);

export default injectIntl(PassPhraseInputs);
