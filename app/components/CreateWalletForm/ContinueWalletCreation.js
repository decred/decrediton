// @flow
import React from "react";
import KeyBlueButton from "../KeyBlueButton";
import ConfirmSeed from "./ConfirmSeed";
import CreatePassPhrase from "./CreatePassPhrase";
import styles from "./styles";

export const ContinueWalletCreation = ({
  isValid,
  setSeed,
  setPassPhrase,
  onCreateWallet,
  ...props
}) => (
  <div style={styles.contentNewSeed}>
    <ConfirmSeed {...props} onChange={setSeed} />
    <CreatePassPhrase passPhraseLabel="Encrypt Wallet" onChange={setPassPhrase} />

    <div style={styles.contentNewSeedCreateButton}>
      <div style={styles.contentConfirmWalletCreateInputLeftPadding}></div>
      <div style={styles.contentConfirmWalletCreateInputRightPadding}>
        <KeyBlueButton
          style={styles.viewButtonKeyBlueWalletNewSeed}
          disabled={!isValid}
          onClick={onCreateWallet}
        >Create Wallet</KeyBlueButton>
      </div>
    </div>
  </div>
);

export default ContinueWalletCreation;
