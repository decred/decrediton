import React from "react";
import Header from "../../../Header";
import CreateWalletForm from "../../../CreateWalletForm";
import TextToggle from "../../../TextToggle";
import SlateGrayButton from "../../../SlateGrayButton";
import { FormattedMessage } from "react-intl";
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
    headerTitleOverview={<FormattedMessage id="getStarted.header.title" defaultMessage="Setting up Decrediton" />}
    headerTop={startupError
      ? <div key="walletCreateError" className="get-started-view-notification-error">{startupError}</div>
      : null}
    headerMetaOverview={(
      <div className="get-started-create-wallet-header">
        <div className="get-started-subheader">
          <FormattedMessage id="getStarted.header.createWallet.meta" defaultMessage="Create a wallet" /></div>
        {isInputRequest ? (
          <div className="get-started-button-toolbar">
            {confirmNewSeed ? (
              <SlateGrayButton
                className="get-started-view-button-go-back"
                onClick={onReturnToNewSeed}
              ><FormattedMessage id="getStarted.backBtn" defaultMessage="Back" /> </SlateGrayButton>
            ) : (
              <TextToggle
                activeButton={"left"}
                leftText={<FormattedMessage id="getStarted.newSeedTab" defaultMessage="New Seed" />}
                rightText={<FormattedMessage id="getStarted.existingSeedTab" defaultMessage="Existing Seed" />}
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
