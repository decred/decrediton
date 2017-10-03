import React from "react";
import Header from "../../../Header";
import KeyBlueButton from "../../../KeyBlueButton";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import "../../../../style/GetStarted.less";

const messages = defineMessages({
  passphrasePlaceholder: {
    id: "getStarted.discoverAddresses.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  }
});

const DiscoverAddressesFormHeader = ({
  startupError
}) => (
  <Header getStarted
    headerTitleOverview={<FormattedMessage id="getStarted.header.title" defaultMessage="Setting up Decrediton" />}
    headerMetaOverview={<FormattedMessage id="getStarted.header.discoveringAddresses.meta" defaultMessage="Discovering addresses" />}
    headerTop={startupError
      ? <div key="pubError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="pubError" ></div>}
  />
);

const DiscoverAddressesFormBodyBase = ({
  passPhrase,
  isInputRequest,
  hasAttemptedDiscover,
  intl,
  onSetPassPhrase,
  onDiscoverAddresses,
  onKeyDown
}) => (
  isInputRequest ? (
    <div className="get-started-content-new-seed page-content">
      <div className="get-started-content-instructions">
        <FormattedMessage id="getStarted.discoverAccountsInfo" defaultMessage={`
          Enter the passphrase you just created to scan the blockchain for additional accounts you may have previously created with your wallet.

          Your account names aren't stored on the blockchain, so you will have to rename them after setting up Decrediton.
        `}/>
      </div>
      <div className="get-started-content-new-seed-create-button">
        <div className="get-started-content-confirm-wallet-create-input-left-padding">Scan for accounts:</div>
        <div className="get-started-content-confirm-wallet-create-input-right-padding">
          <div className="get-started-input-form">
            <form className="get-started-input-form">
              <input
                autoFocus
                className="get-started-input-private-password"
                type="password"
                placeholder={intl.formatMessage(messages.passphrasePlaceholder)}
                value={passPhrase}
                onChange={(e) => onSetPassPhrase(e.target.value)}
                onKeyDown={onKeyDown}/>
            </form>
          </div>
        </div>
        {(hasAttemptedDiscover && !passPhrase) ? (
          <div className="get-started-priv-pass-error">
            <FormattedMessage id="getStarted.discoverAddresses.errors.noPassphrase" defaultMessage="*Please enter your private passphrase" />
          </div>
        ) : null}
        <div className="get-started-content-new-seed-create-button">
          <div className="get-started-content-confirm-wallet-create-input-left-padding"></div>
          <div className="get-started-content-confirm-wallet-create-input-right-padding">
            <KeyBlueButton
              className="get-started-view-button-key-blue-wallet-new-seed"
              onClick={onDiscoverAddresses}
            >
              <FormattedMessage id="getStarted.discoverAddresses.scanBtn" defaultMessage="Scan" />
            </KeyBlueButton>
          </div>
        </div>
      </div>
    </div>
  ) : null
);
const DiscoverAddressesFormBody = injectIntl(DiscoverAddressesFormBodyBase);

export { DiscoverAddressesFormHeader, DiscoverAddressesFormBody };
