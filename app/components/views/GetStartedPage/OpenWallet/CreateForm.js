import React from "react";
import Header from "../../../Header";
import CreateWalletForm from "../../../CreateWalletForm";
import TextToggle from "../../../TextToggle";
import SlateGrayButton from "../../../SlateGrayButton";
import "../../../../style/GetStarted.less";

const OpenWalletCreateFormHeader = ({
  startupError,
  isInputRequest,
  confirmNewSeed,
  onReturnToNewSeed,
  onToggleNewExisting
}) => (
  <Header
    getStarted
    headerTitleOverview={"Setting up Decrediton"}
    headerTop={startupError
      ? <div key="walletCreateError" className="get-started-view-notification-error">{startupError}</div>
      : null}
    headerMetaOverview={(
      <div className="get-started-create-wallet-header">
        <div className="get-started-subheader">Create a wallet</div>
        {isInputRequest ? (
          <div className="get-started-button-toolbar">
            {confirmNewSeed ? (
              <SlateGrayButton
                className="get-started-view-button-go-back"
                onClick={onReturnToNewSeed}
              >Back</SlateGrayButton>
            ) : (
              <TextToggle
                activeButton={"left"}
                leftText={"New seed"}
                rightText={"Existing Seed"}
                toggleAction={onToggleNewExisting}
              />
            )}
          </div>
        ) : null}
      </div>
    )}
  />
);

const OpenWalletCreateFormBody = ({
  isInputRequest
}) => (
  isInputRequest ? <CreateWalletForm /> : null
);

export { OpenWalletCreateFormHeader, OpenWalletCreateFormBody };
