import React from "react";
import PurchaseTickets from "../../PurchaseTickets";
import TicketAutoBuyer from "../../TicketAutoBuyer";
import PassphraseModal from "../../PassphraseModal";
import ImportScriptModal from "../../ImportScriptModal";
import StakeInfo from "../../StakeInfo";
import { StakePoolStyles } from "../ViewStyles";

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
    <div style={isRequestingPassphrase || isShowingImportScript ? StakePoolStyles.contentPurchaseTicketViewBlur : StakePoolStyles.contentPurchaseTicketView}>
      <StakeInfo />
      <PurchaseTickets {...{ ...props, onCancelPassphraseRequest }} />
      <div style={StakePoolStyles.areaSpacing}></div>
      <TicketAutoBuyer {...{ ...props, onCancelPassphraseRequest }} />
    </div>
  </div>
);

export default Tickets;
