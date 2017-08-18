import React from "react";
import "../../../style/CreateWalletForm.less";

const PassPhraseInputs = ({
  passPhraseLabel = "Encrypt Wallet",
  passPhrasePlaceholder = "Private Passphrase",
  passPhraseVerificationLabel = "Verify",
  passPhraseVerificationPlaceholder = "Private Passphrase",
  blankPassPhraseError = "*Please enter your private passphrase",
  passPhraseVerificationError = "*Passwords do not match",
  passPhrase,
  passPhraseVerification,
  isBlank,
  isMatching,
  setPassPhrase,
  setPassPhraseVerification
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
              placeholder={passPhrasePlaceholder}
              value={passPhrase}
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
              placeholder={passPhraseVerificationPlaceholder}
              value={passPhraseVerification}
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

export default PassPhraseInputs;
