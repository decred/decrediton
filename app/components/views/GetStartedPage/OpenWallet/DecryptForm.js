import React from "react";
import Header from "../../../Header";
import KeyBlueButton from "../../../KeyBlueButton";
import "../../../../style/GetStarted.less";

const OpenWalletDecryptFormHeader = ({
  startupError
}) => (
  <Header getStarted
    headerTitleOverview="Setting up Decrediton"
    headerMetaOverview={(
      <div className="get-started-subheader">Opening wallet</div>
    )}
    headerTop={startupError
      ? <div key="walletOpenError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="walletOpenError" ></div>}
  />
);

const OpenWalletDecryptFormBody = ({
  isProcessing,
  publicPassPhrase,
  hasAttemptedOpen,
  onSetPublicPassPhrase,
  onOpenWallet
}) => {
  return isProcessing ? null : (
    <div className="get-started-view">
      <div className="get-started-open-wallet-instructions">
        Please enter the information below to create your dcrwallet.
      </div>
      <div className="get-started-content-new-seed">
        <div className="get-started-content-new-seed-create-button">
          <div className="get-started-content-confirm-wallet-create-input-left-padding">Decrypt Wallet:</div>
          <div className="get-started-content-confirm-wallet-create-input-right-padding">
            <div className="get-started-input-form">
              <form className="get-started-input-form">
                <input
                  className="get-started-input-private-password"
                  type="password"
                  placeholder="Private Passphrase"
                  value={publicPassPhrase}
                  onChange={(e) => onSetPublicPassPhrase(e.target.value)}/>
              </form>
            </div>
          </div>
          {(hasAttemptedOpen && !publicPassPhrase) ? (
            <div className="get-started-priv-pass-error">*Please enter your public passphrase</div>
          ) : null}
          <div className="get-started-content-new-seed-create-button">
            <div className="get-started-content-confirm-wallet-create-input-left-padding"></div>
            <div className="get-started-content-confirm-wallet-create-input-right-padding">
              <KeyBlueButton
                className="get-started-view-button-key-blue-wallet-new-seed"
                onClick={onOpenWallet}
              >Open Wallet</KeyBlueButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { OpenWalletDecryptFormHeader, OpenWalletDecryptFormBody };
