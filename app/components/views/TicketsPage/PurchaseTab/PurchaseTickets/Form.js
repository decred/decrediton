import { PurchaseTicketsInfoModalContent, ImportScriptModal } from "modals";
import { TicketsCogs, InfoModalButton, PassphraseModalButton,
  InvisiblePassphraseModalButton } from "buttons";
import { AccountsSelect, NumTicketsInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import { TransitionMotionWrapper } from "shared";

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
  onChangeNumTickets,
  onChangeAccount,
  onPurchaseTickets,
  onImportScript,
  onRevokeTickets,
  onToggleShowAdvanced,
  account,
  willEnter,
  willLeave,
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
        </div>
      </div>
      <div className="stakepool-purchase-ticket-row-wrapper">
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-row-account-select">
            <div className="stakepool-purchase-ticket-account-select-label"><T id="purchaseTickets.accountFrom" m="From" />:</div>
            <div className="stakepool-purchase-ticket-input-select">
              <AccountsSelect
                {...{ account }} onChange={onChangeAccount} showAccountsButton={true} />
            </div>
          </div>
          <div className="stakepool-purchase-ticket-row-num-tickets">
            <div className="stakepool-purchase-num-tickets-label">
              <T id="purchaseTickets.ticketAmount" m="Amount" />:</div>
            <div className="stakepool-purchase-ticket-num-select">
              <NumTicketsInput
                numTickets={numTicketsToBuy}
                incrementNumTickets={onIncrementNumTickets}
                decrementNumTickets={onDecrementNumTickets}
                onChangeNumTickets={onChangeNumTickets}
              />
            </div>
          </div>
        </div>
        <div className="stakepool-purchase-ticket-info">
          <div className="stakepool-purchase-ticket-action-buttons">
            <TicketsCogs opened={!isShowingAdvanced} onClick={onToggleShowAdvanced} />

            <Tooltip className="stakepool-content-import-script-button-tooltip-container"
              warning={!!rescanRequest}
              text={!rescanRequest
                ? <T id="purchaseTickets.import" m="Manually import a redeem script for tickets." />
                : <T id="purchaseTickets.importDisabledRescan" m="Importing scripts is disabled during a rescan." />}
            >
              <InvisiblePassphraseModalButton
                className="stakepool-content-import-script-button"
                modalTitle={<T id="tickets.importScriptConfirmation" m="Import Script Confirmation" />}
                modalComponent={ImportScriptModal}
                disabled={rescanRequest}
                onSubmit={onImportScript}
              />
            </Tooltip>
          </div>
          <TransitionMotionWrapper {...{
            styles: !isShowingAdvanced ? getQuickBarComponent : getAdvancedComponent,
            willEnter: !isShowingAdvanced ? () => willEnter(270) : () => willEnter(80),
            willLeave
          }}
          />
        </div>
      </div>
      <div className="stakepool-purchase-ticket-buttons-area">
        <PassphraseModalButton
          modalTitle={<T id="tickets.purchaseConfirmation" m="Ticket Purchase Confirmation" />}
          className="stakepool-content-purchase-button"
          disabled={!canAffordTickets}
          onSubmit={onPurchaseTickets}
          buttonLabel={<T id="purchaseTickets.purchaseBtn" m="Purchase" />}
        />
        {!canAffordTickets &&
          <div className="stakepool-purchase-error">
            <T id="purchaseTickets.errors.insufficientBalance" m="Insufficient spendable account balance to purchase tickets." />
          </div>}
        {hasTicketsToRevoke &&
          <PassphraseModalButton
            modalTitle={<T id="tickets.revokeConfirmations" m="Revoke Tickets Confirmation" />}
            className="stakepool-content-revoke-button"
            onSubmit={onRevokeTickets}
            buttonLabel={<T id="purchaseTickets.revokeBtn" m="Revoke" />}
          />
        }
      </div>
    </Aux>);
};

export default PurchaseTicketsForm;
