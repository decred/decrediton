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
  isInputRequest,
  publicPassPhrase,
  hasAttemptedOpen,
  onSetPublicPassPhrase,
  onOpenWallet
}) => (
  isInputRequest ? (
    <div className="get-started-view">
      <div className="get-started-form-ct">
        <div className="get-started-open-wallet-instructions">
          This wallet is encrypted, please enter the public passphrase to decrypt it.
        </div>
        <div className="get-started-field-ct">
          <div className="get-started-label">Decrypt Wallet:</div>
          <div className="get-started-field">
            <form className="get-started-input-form">
              <input
                className="get-started-input-private-password"
                type="password"
                placeholder="Public Passphrase"
                value={publicPassPhrase}
                onChange={(e) => onSetPublicPassPhrase(e.target.value)}/>
            </form>
          </div>
          {(hasAttemptedOpen && !publicPassPhrase) ? (
            <div className="get-started-priv-pass-error">*Please enter your public passphrase</div>
          ) : null}
          <div className="get-started-field-ct">
            <div className="get-started-label"></div>
            <div className="get-started-field">
              <KeyBlueButton onClick={onOpenWallet}>Open Wallet</KeyBlueButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null
);

export { OpenWalletDecryptFormHeader, OpenWalletDecryptFormBody };
