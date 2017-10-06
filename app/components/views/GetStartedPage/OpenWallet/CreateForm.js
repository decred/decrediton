import React from "react";
import Header from "../../../Header";
import CreateWalletForm from "../../../CreateWalletForm";
import TextToggle from "../../../TextToggle";
import SlateGrayButton from "../../../SlateGrayButton";
import { FormattedMessage as T } from "react-intl";
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
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Decrediton" />}
    headerTop={startupError
      ? <div key="walletCreateError" className="get-started-view-notification-error">{startupError}</div>
      : null}
    headerMetaOverview={(
      <div className="get-started-create-wallet-header">
        <div className="get-started-subheader">
          <T id="getStarted.header.createWallet.meta" m="Create a wallet" /></div>
        {isInputRequest ? (
          <div className="get-started-button-toolbar">
            {confirmNewSeed ? (
              <SlateGrayButton
                className="get-started-view-button-go-back"
                onClick={onReturnToNewSeed}
              ><T id="getStarted.backBtn" m="Back" /> </SlateGrayButton>
            ) : (
              <TextToggle
                activeButton={"left"}
                leftText={<T id="getStarted.newSeedTab" m="New Seed" />}
                rightText={<T id="getStarted.existingSeedTab" m="Existing Seed" />}
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
