import { PassphraseModalButton, KeyBlueButton } from "buttons";
import { AccountsSelect, NumTicketsInput, VSPSelect } from "inputs";
import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import { classNames, Checkbox, Tooltip } from "pi-ui";
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
  vsp,
  vspFee,
  setVspFee,
  onV3PurchaseTicket,
  onRevokeTickets,
  availableVSPs,
  isLoading,
  rememberedVspHost,
  toggleRememberVspHostCheckBox,
  notMixedAccounts
}) => (
  <>
    <div className={classNames(styles.purchaseForm, "is-row")}>
      <div className="is-row purchase-ticket-input-address">
        <div className={styles.ticketForm}>
          <div className="purchase-ticket-area-row-label">
            <T id="purchaseTickets.accountFrom" m="Account" />:
          </div>
          <div className={"stakepool-purchase-ticket-input-select-container"}>
            <AccountsSelect
              filterAccounts={notMixedAccounts}
              className="stakepool-purchase-ticket-input-select"
              {...{ account, onChange: setAccount }}
            />
            <div className="stakepool-info-icon account-select-icon" />
          </div>
          <div className="purchase-ticket-area-row-label">
            <T id="purchaseTickets.vspFrom" m="VSP" />:
          </div>
          <div className="purchase-ticket-vsp-container">
            <VSPSelect
              className="stakepool-purchase-ticket-input-select"
              style={{ width: "100%", marginRight: "10px" }}
              {...{
                options: availableVSPs,
                account,
                onChange: setVSP,
                value: vsp,
                isDisabled: !!rememberedVspHost,
                setVspFee
              }}
            />
            {vsp && (
              <Tooltip
                content={<T id="purchaseTickets.vspFee" m="VSP Fee" />}
                className="ticket_pool_fee">
                <div className="stakepool-info-icon stakepool-pool-fee-icon">
                  {vspFee} %
                </div>
              </Tooltip>
            )}
          </div>
          {vsp && (
            <Checkbox
              className={styles.rememberVspCheckBox}
              label={
                <T
                  id="purchaseTickets.alwaysUseThisVSP"
                  m="Always use this VSP"
                />
              }
              id="rememberVspHost"
              checked={!!rememberedVspHost}
              onChange={toggleRememberVspHostCheckBox}
            />
          )}
        </div>
      </div>
      <div className="is-row purchase-ticket-input-amount">
        <div className="purchase-ticket-area-row-label">
          <T id="purchaseTickets.ticketAmount" m="Amount" />:
        </div>
        <NumTicketsInput
          required
          invalid={account.spendable < numTickets * ticketPrice}
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
          showErrors={true}
        />
        {account.spendable >= numTickets * ticketPrice && (
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
      <div className="purchase-ticket-action-buttons is-column" />
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
        <KeyBlueButton disabled={!isValid} onClick={onV3PurchaseTicket}>
          {purchaseLabel()}
        </KeyBlueButton>
      ) : isLoading ? (
        <KeyBlueButton disabled={true}>
          <T id="tickets.purchase.loading" m="Loading" />
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
          onSubmit={onV3PurchaseTicket}
          buttonLabel={purchaseLabel()}
        />
      )}
    </div>
  </>
);

export default PurchaseTicketsForm;
