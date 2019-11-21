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
  onIncrementNumTickets,
  onDecrementNumTickets,
  onChangeNumTickets,
  onChangeAccount,
  onPurchaseTickets,
  onRevokeTickets,
  onToggleShowAdvanced,
  account,
  willEnter,
  willLeave
}) => (
  <>
    <div className="purchase-ticket-area-row is-row">
      <div className="is-row purchase-ticket-input-address">
        <div className="purchase-ticket-area-row-label"><T id="purchaseTickets.accountFrom" m="From" />:</div>
        <AccountsSelect className="stakepool-purchase-ticket-input-select"
          {...{ account, onChange: onChangeAccount }}/>
        <div className="stakepool-info-icon account-select-icon"></div>
      </div>
      <div className="is-row purchase-ticket-input-amount">
        <div className="purchase-ticket-area-row-label">
          <T id="purchaseTickets.ticketAmount" m="Amount" />:</div>
        <NumTicketsInput
          required
          invalid={!getIsValid()}
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
    <div className="stakepool-purchase-ticket-info">
      <div className="purchase-ticket-action-buttons is-column">
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
      {hasTicketsToRevoke &&
    <PassphraseModalButton
      modalTitle={<T id="tickets.revokeConfirmations" m="Revoke Tickets Confirmation" />}
      className="stakepool-content-revoke-button"
      onSubmit={onRevokeTickets}
      buttonLabel={<T id="purchaseTickets.revokeBtn" m="Revoke" />}
    />
      }
      <PassphraseModalButton
        modalTitle={<T id="tickets.purchaseConfirmation" m="Ticket Purchase Confirmation" />}
        disabled={getIsValid && !getIsValid()}
        onSubmit={onPurchaseTickets}
        buttonLabel={<T id="purchaseTickets.purchaseBtn" m="Purchase" />}
      />
    </div>
  </>);

export default PurchaseTicketsForm;
