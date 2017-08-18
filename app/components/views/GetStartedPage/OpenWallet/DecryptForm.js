import React from "react";
import Header from "../../../Header";
import DecredLoading from "../../../DecredLoading";
import KeyBlueButton from "../../../KeyBlueButton";
import { GetStartedStyles } from "../../ViewStyles";

const OpenWalletDecryptForm = ({
  startupError,
  isProcessing,
  publicPassPhrase,
  hasAttemptedOpen,
  onSetPublicPassPhrase,
  onOpenWallet
}) => (
  <div style={GetStartedStyles.view}>
    <Header getStarted
      headerTitleOverview="Opening Wallet"
      headerMetaOverview="Please enter the information below to  create your dcrwallet"
      headerTop={startupError
        ? <div key="walletOpenError" style={GetStartedStyles.viewNotificationError}>{startupError}</div>
        : <div key="walletOpenError" ></div>}
    />
    <div style={GetStartedStyles.contentNewSeed}>
      {isProcessing ? <DecredLoading/> : (
        <div style={GetStartedStyles.contentNewSeedCreateButton}>
          <div style={GetStartedStyles.contentConfirmWalletCreateInputLeftPadding}>Decrypt Wallet:</div>
          <div style={GetStartedStyles.contentConfirmWalletCreateInputRightPadding}>
            <div style={GetStartedStyles.inputForm}>
              <form style={GetStartedStyles.inputForm}>
                <input
                  style={GetStartedStyles.inputPrivatePassword}
                  type="password"
                  placeholder="Private Passphrase"
                  value={publicPassPhrase}
                  onChange={(e) => onSetPublicPassPhrase(e.target.value)}/>
              </form>
            </div>
          </div>
          {(hasAttemptedOpen && !publicPassPhrase) ? (
            <div style={GetStartedStyles.privPassError}>*Please enter your public passphrase</div>
          ) : null}
          <div style={GetStartedStyles.contentNewSeedCreateButton}>
            <div style={GetStartedStyles.contentConfirmWalletCreateInputLeftPadding}></div>
            <div style={GetStartedStyles.contentConfirmWalletCreateInputRightPadding}>
              <KeyBlueButton
                style={GetStartedStyles.viewButtonKeyBlueWalletNewSeed}
                onClick={onOpenWallet}
              >Open Wallet</KeyBlueButton>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default OpenWalletDecryptForm;
