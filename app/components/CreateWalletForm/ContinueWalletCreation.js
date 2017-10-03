// @flow
import React from "react";
import KeyBlueButton from "../KeyBlueButton";
import ConfirmSeed from "./ConfirmSeed";
import CreatePassPhrase from "./CreatePassPhrase";
import { FormattedMessage } from "react-intl";
import "../../style/CreateWalletForm.less";

const ContinueWalletCreation = ({
  isValid,
  setSeed,
  setPassPhrase,
  onCreateWallet,
  ...props
}) => (
  <div className="page-content new-seed">
    <ConfirmSeed {...props} onChange={setSeed} />
    <CreatePassPhrase passPhraseLabel={
      <FormattedMessage id="createWallet.encryptWallet" defaultMessage="Encrypt Wallet" />}
      onChange={setPassPhrase} onSubmit={onCreateWallet} />

    <div className="create-wallet-button-container">
      <div className="create-wallet-label"></div>
      <div className="create-wallet-field">
        <KeyBlueButton
          className="wallet-key-blue-button"
          disabled={!isValid}
          onClick={onCreateWallet}
        >
          <FormattedMessage id="createWallet.createWalletBtn" defaultMessage="Create Wallet" />
        </KeyBlueButton>
      </div>
    </div>
  </div>
);

export default ContinueWalletCreation;
