import {
  TicketsCogs,
  PassphraseModalButton,
  KeyBlueButton,
  InvisibleConfirmModalButton
} from "buttons";
import { AccountsSelect, NumTicketsInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import {
  TransitionMotionWrapper,
  ShowWarning,
  ExternalLink,
  Balance
} from "shared";

import "style/StakePool.less";

const purchaseLabel = () => <T id="purchaseTickets.purchaseBtn" m="Purchase" />;

const PurchaseTicketsForm = ({
  isShowingAdvanced,
  getQuickBarComponent,
  getAdvancedComponent,
  isValid,
  handleOnKeyDown,
  numTicketsToBuy,
  onIncrementNumTickets,
  onDecrementNumTickets,
  onChangeNumTickets,
  onChangeAccount,
  onPurchaseTickets,
  onRevokeTickets,
  onToggleShowAdvanced,
  account,
  ticketPrice,
  willEnter,
  willLeave,
  toggleShowVsp,
  dismissBackupRedeemScript,
  onDismissBackupRedeemScript,
  isWatchingOnly
}) => (
  <>
    <div className="purchase-ticket-area-row is-row">
      <div className="is-row purchase-ticket-input-address">
        <div className="purchase-ticket-area-row-label">
          <T id="purchaseTickets.accountFrom" m="From" />:
        </div>
        <AccountsSelect
          className="stakepool-purchase-ticket-input-select"
          {...{ account, onChange: onChangeAccount }}
        />
        <div className="stakepool-info-icon account-select-icon"></div>
      </div>
      <div className="is-row purchase-ticket-input-amount">
        <div className="purchase-ticket-area-row-label">
          <T id="purchaseTickets.ticketAmount" m="Amount" />:
        </div>
        <NumTicketsInput
          required
          invalid={!isValid}
          invalidMessage={
            <T
              id="purchaseTickets.errors.insufficientBalance"
              m="Not enough funds"
            />
          }
          numTickets={numTicketsToBuy}
          incrementNumTickets={onIncrementNumTickets}
          decrementNumTickets={onDecrementNumTickets}
          onChangeNumTickets={onChangeNumTickets}
          onKeyDown={handleOnKeyDown}
          showErrors={true}></NumTicketsInput>
        {isValid && (
          <div className="input-purchase-ticket-valid-message-area">
            <T
              id="purchaseTickets.validMsg"
              m="Total: {amount} Remaining: {remaining}"
              values={{
                amount: <Balance flat amount={numTicketsToBuy * ticketPrice} />,
                remaining: (
                  <Balance
                    flat
                    amount={account.spendable - numTicketsToBuy * ticketPrice}
                  />
                )
              }}
            />
          </div>
        )}
      </div>
    </div>
    <div className="stakepool-purchase-ticket-info">
      <div className="purchase-ticket-action-buttons is-column">
        <TicketsCogs
          opened={!isShowingAdvanced}
          onClick={onToggleShowAdvanced}
        />
      </div>
      <>{/* ADD VSP INFO HERE */}</>
    </div>
    <div className="stakepool-purchase-ticket-buttons-area">
      <PassphraseModalButton
        modalTitle={
          <T id="tickets.revokeConfirmations" m="Revoke Tickets Confirmation" />
        }
        className="stakepool-content-revoke-button"
        onSubmit={onRevokeTickets}
        buttonLabel={<T id="purchaseTickets.revokeBtn" m="Revoke" />}
      />
      {isWatchingOnly ? (
        <KeyBlueButton disabled={!isValid} onClick={onPurchaseTickets}>
          {purchaseLabel()}
        </KeyBlueButton>
      ) : (
        <PassphraseModalButton
          modalTitle={
            <T
              id="tickets.purchaseConfirmation"
              m="Ticket Purchase Confirmation"
            />
          }
          disabled={!isValid}
          onSubmit={onPurchaseTickets}
          buttonLabel={purchaseLabel()}
        />
      )}
    </div>
  </>
);

export default PurchaseTicketsForm;
