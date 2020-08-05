import { PassphraseModalButton, KeyBlueButton } from "buttons";
import { AccountsSelect, NumTicketsInput, VSPSelect } from "inputs";
import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import styles from "../PurchaseTab.module.css";

import "style/StakePool.less";

const purchaseLabel = () => <T id="purchaseTickets.purchaseBtn" m="Purchase" />;

const PurchaseTicketsForm = ({
  isValid,
  handleOnKeyDown,
  numTickets,
  onChangeNumTickets,
  setNumTickets,
  setAccount,
  account,
  ticketPrice,
  isWatchingOnly,
  setVSP,
  onPurchaseTickets,
  onRevokeTickets,
  availableVSPs
}) => (
  <>
    <div className="purchase-ticket-area-row is-row">
      <div className="is-row purchase-ticket-input-address">
        <div className={styles.ticketForm}>
          <div className="purchase-ticket-area-row-label">
            <T id="purchaseTickets.accountFrom" m="From Account" />:
          </div>
          <div className={"stakepool-purchase-ticket-input-select-container"}>
            <AccountsSelect
              className="stakepool-purchase-ticket-input-select"
              {...{ account, onChange: setAccount }}
            />
            <div className="stakepool-info-icon account-select-icon" />
          </div>
          <div className="purchase-ticket-area-row-label">
            <T id="purchaseTickets.vspFrom" m="From VSP" />:
          </div>
          <VSPSelect
            className="stakepool-purchase-ticket-input-select"
            {...{ options: availableVSPs, account, onChange: setVSP }}
          />
        </div>
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
          numTickets={numTickets}
          incrementNumTickets={() => onChangeNumTickets(true)}
          decrementNumTickets={() => onChangeNumTickets(false)}
          onChangeNumTickets={setNumTickets}
          onKeyDown={handleOnKeyDown}
          showErrors={true}></NumTicketsInput>
        {isValid && (
          <div className="input-purchase-ticket-valid-message-area">
            <T
              id="purchaseTickets.validMsg"
              m="Total: {amount} Remaining: {remaining}"
              values={{
                amount: <Balance flat amount={numTickets * ticketPrice} />,
                remaining: (
                  <Balance
                    flat
                    amount={account.spendable - numTickets * ticketPrice}
                  />
                )
              }}
            />
          </div>
        )}
      </div>
    </div>
    <div className="stakepool-purchase-ticket-info">
      <div className="purchase-ticket-action-buttons is-column"></div>
      {/* ADD VSP INFO HERE */}
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
