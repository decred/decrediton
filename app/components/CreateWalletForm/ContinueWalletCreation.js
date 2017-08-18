// @flow
import React from "react";
import KeyBlueButton from "../KeyBlueButton";
import ConfirmSeed from "./ConfirmSeed";
import CreatePassPhrase from "./CreatePassPhrase";
import "../../style/CreateWalletForm.less";

const ContinueWalletCreation = ({
  isValid,
  setSeed,
  setPassPhrase,
  onCreateWallet,
  ...props
}) => (
  <div className="new-seed">
    <ConfirmSeed {...props} onChange={setSeed} />
    <CreatePassPhrase passPhraseLabel="Encrypt Wallet" onChange={setPassPhrase} />

    <div className="create-wallet-button-container">
      <div className="create-wallet-label"></div>
      <div className="create-wallet-field">
        <KeyBlueButton
          className="wallet-key-blue-button"
          disabled={!isValid}
          onClick={onCreateWallet}
        >Create Wallet</KeyBlueButton>
      </div>
    </div>
  </div>
);

export default ContinueWalletCreation;
