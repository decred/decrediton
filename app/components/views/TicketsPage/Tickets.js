import React from "react";
import PurchaseTickets from "../../PurchaseTickets";
import TicketAutoBuyer from "../../TicketAutoBuyer";
import PassphraseModal from "../../PassphraseModal";
import ImportScriptModal from "../../ImportScriptModal";
import StakeInfo from "../../StakeInfo";
import "../../../style/StakePool.less";

const Tickets = ({
  isRequestingPassphrase,
  isShowingImportScript,
  passphraseCallback,
  passphraseHeading,
  passphraseDescription,
  onCancelPassphraseRequest,
  onImportScript,
  onCancelImportScript,
  ...props
}) => (
  <div>
    <PassphraseModal
      hidden={!isRequestingPassphrase}
      submitPassphrase={passphraseCallback}
      cancelPassphrase={onCancelPassphraseRequest}
      heading={passphraseHeading}
      description={passphraseDescription}
    />
    <ImportScriptModal
      hidden={!isShowingImportScript}
      submitImportScript={onImportScript}
      cancelImportScript={onCancelImportScript}
      heading={"Enter Passphrase to Import Script"}
      description={<div>Please enter your Script from your configured stakepool:</div>}
    />
    <div className={isRequestingPassphrase || isShowingImportScript ? "stakepool-content-purchase-ticket-view-blur page-content" : "stakepool-content-purchase-ticket-view page-content"}>
      <StakeInfo />
      <PurchaseTickets {...{ ...props, onCancelPassphraseRequest }} />
      <div className="stakepool-area-spacing"></div>
      <TicketAutoBuyer {...{ ...props, onCancelPassphraseRequest }} />
    </div>
  </div>
);

export default Tickets;
