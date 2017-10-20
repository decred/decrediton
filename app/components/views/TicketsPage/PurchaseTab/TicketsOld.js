import React from "react";
import PurchaseTickets from "../../PurchaseTickets";
import TicketAutoBuyer from "../../TicketAutoBuyer";
import PassphraseModal from "../../PassphraseModal";
import ImportScriptModal from "../../ImportScriptModal";
import { FormattedMessage as T } from "react-intl";
import StakeInfo from "../../StakeInfo";
import "style/StakePool.less";

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
  <Aux>
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
      heading={<T id="importScript.title" m="Enter Passphrase to Import Script" />}
      description={<div><T id="importScript.description" m="Please enter your Script from your configured stakepool" />:</div>}
    />
    <div className={isRequestingPassphrase || isShowingImportScript ? "stakepool-content-purchase-ticket-view-blur page-content" : "stakepool-content-purchase-ticket-view page-content"}>
      <StakeInfo />
      <PurchaseTickets {...{ ...props, onCancelPassphraseRequest }} />
      <div className="stakepool-area-spacing"></div>
      <TicketAutoBuyer {...{ ...props, onCancelPassphraseRequest }} />
    </div>
  </Aux>
);

export default Tickets;
