import React from "react";
import Header from "../../../Header";
import CreateWalletForm from "../../../CreateWalletForm";
import TextToggle from "../../../TextToggle";
import DecredLoading from "../../../DecredLoading";
import SlateGrayButton from "../../../SlateGrayButton";
import "../../../../style/GetStarted.less";

const OpenWalletCreateForm = ({
  startupError,
  isProcessing,
  confirmNewSeed,
  onReturnToNewSeed,
  onToggleNewExisting
}) => (
  <div className="get-started-view">
    <Header
      getStarted
      headerTitleOverview={"Create a Wallet"}
      headerTop={startupError
        ? <div key="walletCreateError" className="get-started-view-notification-error">{startupError}</div>
        : <div key="walletCreateError" ></div>}
      headerMetaOverview={
        <div className="get-started-toggle">
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
      }
    />
    {isProcessing
      ? <div className="get-started-content-new-seed"><DecredLoading/></div>
      : <CreateWalletForm />}
  </div>
);

export default OpenWalletCreateForm;
