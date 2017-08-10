import React from "react";
import styles from "../styles";

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
    <div style={styles.contentNewSeedPrivPass}>
      <div style={styles.contentConfirmWalletCreateInputLeftPadding}>{passPhraseLabel}:</div>
      <div style={styles.contentConfirmWalletCreateInputRightPadding}>
        <div style={styles.inputForm}>
          <form style={styles.inputForm}>
            <input
              style={styles.inputPrivatePassword}
              type="password"
              placeholder={passPhrasePlaceholder}
              value={passPhrase}
              onChange={(e) => setPassPhrase(e.target.value)}
            />
          </form>
        </div>
        {isBlank ? <div style={styles.inputFormError}>{blankPassPhraseError}</div> : null}
      </div>
    </div>
    <div style={styles.contentNewSeedPrivPass}>
      <div style={styles.contentConfirmWalletCreateInputLeftPadding}>{passPhraseVerificationLabel}:</div>
      <div style={styles.contentConfirmWalletCreateInputRightPadding}>
        <div style={styles.inputForm}>
          <form style={styles.inputForm}>
            <input
              style={styles.inputPrivatePassword}
              type="password"
              placeholder={passPhraseVerificationPlaceholder}
              value={passPhraseVerification}
              onChange={(e) => setPassPhraseVerification(e.target.value)}
            />
          </form>
        </div>
        {(!isBlank && !isMatching) ? (
          <div style={styles.inputFormError}>{passPhraseVerificationError}</div>
        ) : null}
      </div>
    </div>
  </div>
);

export default PassPhraseInputs;
