import React from "react";
import Header from "../../../Header";
import DecredLoading from "../../../DecredLoading";
import KeyBlueButton from "../../../KeyBlueButton";
import { GetStartedStyles } from "../../ViewStyles";

const DiscoverAddressesForm = ({
  startupError,
  passPhrase,
  isProcessing,
  hasAttemptedDiscover,
  onSetPassPhrase,
  onDiscoverAddresses
}) => (
  <div style={GetStartedStyles.view}>
    <Header getStarted
      headerTitleOverview="Discovering addresses"
      headerMetaOverview="Please enter the information below to load your dcrwallet"
      headerTop={startupError
        ? <div key="pubError" style={GetStartedStyles.viewNotificationError}>{startupError}</div>
        : <div key="pubError" ></div>}
    />
    <div style={GetStartedStyles.contentNewSeed}>
      {isProcessing ? <DecredLoading/> : (
        <div style={GetStartedStyles.contentNewSeedCreateButton}>
          <div style={GetStartedStyles.contentConfirmWalletCreateInputLeftPadding}>Scan for used accounts:</div>
          <div style={GetStartedStyles.contentConfirmWalletCreateInputRightPadding}>
            <div style={GetStartedStyles.inputForm}>
              <form style={GetStartedStyles.inputForm}>
                <input
                  style={GetStartedStyles.inputPrivatePassword}
                  type="password"
                  placeholder="Private Passphrase"
                  value={passPhrase}
                  onChange={(e) => onSetPassPhrase(e.target.value)}/>
              </form>
            </div>
          </div>
          {(hasAttemptedDiscover && !passPhrase) ? (
            <div style={GetStartedStyles.privPassError}>*Please enter your private passphrase</div>
          ) : null}
          <div style={GetStartedStyles.contentNewSeedCreateButton}>
            <div style={GetStartedStyles.contentConfirmWalletCreateInputLeftPadding}></div>
            <div style={GetStartedStyles.contentConfirmWalletCreateInputRightPadding}>
              <KeyBlueButton
                style={GetStartedStyles.viewButtonKeyBlueWalletNewSeed}
                onClick={onDiscoverAddresses}
              >Scan</KeyBlueButton>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default DiscoverAddressesForm;
