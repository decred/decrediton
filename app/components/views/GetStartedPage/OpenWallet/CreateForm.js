import React from "react";
import Header from "../../../Header";
import CreateWalletForm from "../../../CreateWalletForm";
import TextToggle from "../../../TextToggle";
import DecredLoading from "../../../DecredLoading";
import SlateGrayButton from "../../../SlateGrayButton";
import { GetStartedStyles } from "../../ViewStyles";

const OpenWalletCreateForm = ({
  startupError,
  isProcessing,
  confirmNewSeed,
  onReturnToNewSeed,
  onToggleNewExisting
}) => (
  <div style={GetStartedStyles.view}>
    <Header
      getStarted
      headerTitleOverview={"Create a Wallet"}
      headerTop={startupError
        ? <div key="walletCreateError" style={GetStartedStyles.viewNotificationError}>{startupError}</div>
        : <div key="walletCreateError" ></div>}
      headerMetaOverview={
        <div style={GetStartedStyles.toggle}>
          {confirmNewSeed ? (
            <SlateGrayButton
              style={GetStartedStyles.viewButtonGoBack}
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
      ? <div style={GetStartedStyles.contentNewSeed}><DecredLoading/></div>
      : <CreateWalletForm />}
  </div>
);

export default OpenWalletCreateForm;
