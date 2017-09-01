import React from "react";
import Header from "../../../Header";
import KeyBlueButton from "../../../KeyBlueButton";
import "../../../../style/GetStarted.less";

const DiscoverAddressesFormHeader = ({
  startupError
}) => (
  <Header getStarted
    headerTitleOverview="Setting up Decrediton"
    headerMetaOverview="Discovering addresses"
    headerTop={startupError
      ? <div key="pubError" className="get-started-view-notification-error">{startupError}</div>
      : <div key="pubError" ></div>}
  />
);

const DiscoverAddressesFormBody = ({
  passPhrase,
  isInputRequest,
  hasAttemptedDiscover,
  onSetPassPhrase,
  onDiscoverAddresses
}) => (
  isInputRequest ? (
    <div className="get-started-content-new-seed">
      <div className="get-started-content-new-seed-create-button">
        <div className="get-started-content-confirm-wallet-create-input-left-padding">Scan for used accounts:</div>
        <div className="get-started-content-confirm-wallet-create-input-right-padding">
          <div className="get-started-input-form">
            <form className="get-started-input-form">
              <input
                className="get-started-input-private-password"
                type="password"
                placeholder="Private Passphrase"
                value={passPhrase}
                onChange={(e) => onSetPassPhrase(e.target.value)}/>
            </form>
          </div>
        </div>
        {(hasAttemptedDiscover && !passPhrase) ? (
          <div className="get-started-priv-pass-error">*Please enter your private passphrase</div>
        ) : null}
        <div className="get-started-content-new-seed-create-button">
          <div className="get-started-content-confirm-wallet-create-input-left-padding"></div>
          <div className="get-started-content-confirm-wallet-create-input-right-padding">
            <KeyBlueButton
              className="get-started-view-button-key-blue-wallet-new-seed"
              onClick={onDiscoverAddresses}
            >Scan</KeyBlueButton>
          </div>
        </div>
      </div>
    </div>
  ) : null
);

export { DiscoverAddressesFormHeader, DiscoverAddressesFormBody };
