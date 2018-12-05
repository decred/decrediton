import { TicketsCogs, InfoDocModalButton, PassphraseModalButton,
  ImportScriptIconButton } from "buttons";
import { AccountsSelect, NumTicketsInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import { TransitionMotionWrapper } from "shared";

import "style/StakePool.less";

const PurchaseTicketsForm = ({
  isShowingAdvanced,
  getQuickBarComponent,
  getAdvancedComponent,
  getIsValid,
  handleOnKeyDown,
  hasTicketsToRevoke,
  numTicketsToBuy,
  canAffordTickets,
  onIncrementNumTickets,
  onDecrementNumTickets,
  onChangeNumTickets,
  onChangeAccount,
  onPurchaseTickets,
  onRevokeTickets,
  onToggleShowAdvanced,
  account,
  willEnter,
  willLeave,
}) => {

  return (
    <Aux>
      <div className="stakepool-voting-title-area">
        <div className="stakepool-purchase-ticket-input-buttons">
          <InfoDocModalButton document="PurchaseTicketsInfo" modalClassName="info-modal-fields" double/>
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
                required
                invalid={!canAffordTickets}
                invalidMessage={<T id="purchaseTickets.errors.insufficientBalance" m="Not enough funds" />}
                numTickets={numTicketsToBuy}
                incrementNumTickets={onIncrementNumTickets}
                decrementNumTickets={onDecrementNumTickets}
                onChangeNumTickets={onChangeNumTickets}
                onKeyDown={handleOnKeyDown}
                showErrors={true}
              />
            </div>
          </div>
        </div>
        <div className="stakepool-purchase-ticket-info">
          <div className="stakepool-purchase-ticket-action-buttons">
            <TicketsCogs opened={!isShowingAdvanced} onClick={onToggleShowAdvanced} />
            <ImportScriptIconButton />
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
          disabled={getIsValid && !getIsValid()}
          onSubmit={onPurchaseTickets}
          buttonLabel={<T id="purchaseTickets.purchaseBtn" m="Purchase" />}
        />
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
