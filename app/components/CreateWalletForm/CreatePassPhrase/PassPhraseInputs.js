import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import "style/CreateWalletForm.less";
import InfoModalButton from "InfoModalButton";
import { PassphraseInfoModalContent } from "modals";

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
  passPhraseLabel = <T id="createWallet.passhraseInput.label" m="Create wallet private passphrase" />,
  passPhraseVerificationLabel = <T id="createWallet.passphraseInput.verifyLabel" m="Confirm private passphrase" />,
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
      <div className="content-new-seed-priv-pass">
        <div className="create-wallet-label">{passPhraseLabel}:
          <InfoModalButton
            modalTitle={<h1><T id="confirmSeed.passphraseInformation" m="Private passphrase information" /></h1>}
            modalContent={<PassphraseInfoModalContent />}
          />
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
      <div className="content-new-seed-priv-pass">
        <div className="create-wallet-label">{passPhraseVerificationLabel}:</div>
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
