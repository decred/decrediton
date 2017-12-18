import { PurchaseTicketsInfoModalContent, ImportScriptModalContent } from "modals";
import { TicketsCogs, InfoModalButton, PassphraseModalButton } from "buttons";
import { AccountsSelect, NumTicketsInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import {TransitionMotionWrapper} from "shared";

import "style/StakePool.less";

const PurchaseTicketsForm = ({
  isShowingAdvanced,
  getQuickBarComponent,
  getAdvancedComponent,
  hasTicketsToRevoke,
  numTicketsToBuy,
  canAffordTickets,
  rescanRequest,
  onIncrementNumTickets,
  onDecrementNumTickets,
  onChangeAccount,
  onPurchaseTickets,
  onImportScript,
  onRevokeTickets,
  onToggleShowAdvanced,
  account
}) => {

  return (
    <Aux>
      <div className="stakepool-voting-title-area">
        <div className="stakepool-voting-title-area-name">
          <T id="purchaseTickets.title" m="Purchase Tickets" />
        </div>
        <div className="stakepool-purchase-ticket-input-buttons">
          <InfoModalButton
            modalTitle={<h1><T id="purchaseInfoModal.title" m="Ticket Purchase Information" /></h1>}
            modalContent={<PurchaseTicketsInfoModalContent />}
          />
          <TicketsCogs opened={!isShowingAdvanced} onClick={onToggleShowAdvanced} />
        </div>
      </div>
      <div className={isShowingAdvanced ? "stakepool-flex-height-shown" : "stakepool-flex-height-hidden"}>
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-row-account-select">
            <div className="stakepool-purchase-ticket-account-select-label"><T id="purchaseTickets.account" m="Account" />:</div>
            <div className="stakepool-purchase-ticket-input-select">
              <AccountsSelect
                {...{ account }} onChange={onChangeAccount} showAccountsButton={true} />
            </div>
          </div>
          <div className="stakepool-purchase-ticket-row-num-tickets">
            <div className="stakepool-purchase-num-tickets-label">
              <T id="purchaseTickets.number" m="Number of Tickets" />:</div>
            <div className="stakepool-purchase-ticket-num-select">
              <NumTicketsInput
                numTickets={numTicketsToBuy}
                incrementNumTickets={onIncrementNumTickets}
                decrementNumTickets={onDecrementNumTickets}
              />
            </div>
          </div>
        </div>
        <TransitionMotionWrapper {...{
          styles: !isShowingAdvanced ? getQuickBarComponent : getAdvancedComponent }}
        />
      </div>
      <div className="stakepool-purchase-ticket-buttons-area">
        <PassphraseModalButton
          modalTitle={<T id="tickets.purchaseConfirmation" m="Ticket Purchase Confirmation" />}
          className="stakepool-content-purchase-button"
          disabled={!canAffordTickets}
          onSubmit={onPurchaseTickets}
        >
          <T id="purchaseTickets.purchaseBtn" m="Purchase" />
        </PassphraseModalButton>
        {!canAffordTickets &&
          <div className="stakepool-purchase-error">
            <T id="purchaseTickets.errors.insufficientBalance" m="Insufficient spendable account balance to purchase tickets." />
          </div>}
        <Tooltip className="stakepool-content-import-script-button" warning disabled={!rescanRequest}
          text={<T id="purchaseTickets.importDisabledRescan" m="Importing scripts is disabled during a rescan." />}>
          <PassphraseModalButton
            modalTitle={<T id="tickets.importScriptConfirmation" m="Import Script Confirmation" />}
            modalContent={ImportScriptModalContent}
            className="stakepool-content-purchase-button"
            disabled={rescanRequest}
            onSubmit={onImportScript}
          >
            <T id="purchaseTickets.importScriptBtn" m="Import Script" />
          </PassphraseModalButton>
        </Tooltip>
        {hasTicketsToRevoke &&
          <PassphraseModalButton
            modalTitle={<T id="tickets.revokeConfirmations" m="Revoke Tickets Confirmation" />}
            className="stakepool-content-revoke-button"
            onSubmit={onRevokeTickets}
          >
            <T id="purchaseTickets.revokeBtn" m="Revoke" />
          </PassphraseModalButton>
        }
      </div>
    </Aux>);
};

export default PurchaseTicketsForm;
