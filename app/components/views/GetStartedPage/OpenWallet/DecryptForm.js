import React from "react";
import Header from "../../../Header";
import KeyBlueButton from "../../../KeyBlueButton";
import { FormattedMessage } from "react-intl";
import "../../../../style/GetStarted.less";

const OpenWalletDecryptFormHeader = ({
  startupError
}) => (
  <Header getStarted
    headerTitleOverview={<FormattedMessage id="getStarted.header.title" defaultMessage="Setting up Decrediton" />}
    headerMetaOverview={(
      <div className="get-started-subheader">
        <FormattedMessage id="getStarted.header.openingWallet.meta" defaultMessage="Opening wallet" />
      </div>
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
  onOpenWallet,
  onKeyDown
}) => (
  isInputRequest ? (
    <div className="get-started-view">
      <div className="get-started-form-ct">
        <div className="get-started-content-instructions">
          <FormattedMessage id="getStarted.decrypt.info" defaultMessage="This wallet is encrypted, please enter the public passphrase to decrypt it." />
        </div>
        <div className="get-started-field-ct">
          <div className="get-started-label">
            <FormattedMessage id="getStarted.decrypt.label" defaultMessage="Decrypt Wallet" />
            :</div>
          <div className="get-started-field">
            <form className="get-started-input-form">
              <input
                autoFocus
                className="get-started-input-private-password"
                type="password"
                placeholder="Public Passphrase"
                value={publicPassPhrase}
                onChange={(e) => onSetPublicPassPhrase(e.target.value)}
                onKeyDown={onKeyDown}/>
            </form>
          </div>
          {(hasAttemptedOpen && !publicPassPhrase) ? (
            <div className="get-started-priv-pass-error">
              <FormattedMessage id="getStarted.decrypt.errors.noPublicPassphrase" defaultMessage="*Please enter your public passphrase" />
            </div>
          ) : null}
          <div className="get-started-field-ct">
            <div className="get-started-label"></div>
            <div className="get-started-field">
              <KeyBlueButton onClick={onOpenWallet}>
                <FormattedMessage id="getStarted.decrypt.openWalletBtn" defaultMessage="Open Wallet" />
              </KeyBlueButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null
);

export { OpenWalletDecryptFormHeader, OpenWalletDecryptFormBody };
