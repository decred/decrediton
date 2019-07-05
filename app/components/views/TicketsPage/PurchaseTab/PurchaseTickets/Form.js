import { TicketsCogs, PassphraseModalButton, ImportScriptIconButton } from "buttons";
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
}) => (
  <>
    <div className="purchase-ticket-area-row is-row">
      <div className="purchase-ticket-area-row-label"><T id="purchaseTickets.accountFrom" m="From" />:</div>
      <AccountsSelect className="stakepool-purchase-ticket-input-select" 
        {...{ account, onChange: onChangeAccount }}/>
      <div className="purchase-ticket-area-row-label">
        <T id="purchaseTickets.ticketAmount" m="Amount" />:</div>
      <NumTicketsInput
        required
        className="stakepool-purchase-ticket-num-select"
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
  </>);

export default PurchaseTicketsForm;
