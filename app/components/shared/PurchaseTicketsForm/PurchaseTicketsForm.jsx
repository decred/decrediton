import { FormattedMessage as T } from "react-intl";
import { classNames, Checkbox, Tooltip } from "pi-ui";
import {
  TicketPurchaseModalButton,
  RevokeModalButton,
  PiUiButton
} from "buttons";
import { AccountsSelect, NumTicketsInput, VSPSelect } from "inputs";
import { Balance } from "shared";
import styles from "./PurchaseTicketsForm.module.css";

const purchaseLabel = () => <T id="purchaseTickets.purchaseBtn" m="Purchase" />;
export const LegacyVSPWarning = () => (
  <T
    id="purchase.isLegacyDescription"
    m="Use a VSP which has not updated to vspd. Not recommended, legacy VSP support will soon be removed."
  />
);

const PurchaseTicketsForm = ({
  isValid,
  handleOnKeyDown,
  numTicketsToBuy,
  onChangeNumTickets,
  onIncrementNumTickets,
  onDecrementNumTickets,
  setAccount,
  account,
  ticketPrice,
  isWatchingOnly,
  setVSP,
  vsp,
  vspFee,
  setVspFee,
  onPurchaseTicket,
  onRevokeTickets,
  availableVSPs,
  isLoading,
  rememberedVspHost,
  toggleRememberVspHostCheckBox,
  notMixedAccounts,
  getRunningIndicator,
  toggleIsLegacy
}) => (
  <>
    <div className={classNames(styles.purchaseForm, styles.isRow)}>
      <div className={classNames(styles.isColumn, styles.inputAddress)}>
        <label className={styles.rowLabel}>
          <T id="purchaseTickets.accountFrom" m="Account" />
          <div
            className={classNames(
              styles.inputSelectContainer,
              "selectWithBigFont"
            )}>
            <AccountsSelect
              filterAccounts={notMixedAccounts}
              className={styles.inputSelect}
              selectClassName={styles.accountSelectInput}
              {...{ account, onChange: setAccount }}
            />
          </div>
        </label>
        <label className={styles.rowLabel}>
          <T id="purchaseTickets.vspFrom" m="VSP" />
          <div className={classNames(styles.vspContainer, "selectWithBigFont")}>
            <VSPSelect
              className={styles.inputSelect}
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
          </div>
        </label>
        <div className={styles.checkboxWrapper}>
          <div>
            <Tooltip
              contentClassName={styles.useLegacyTooltip}
              content={<LegacyVSPWarning />}>
              <Checkbox
                label={<T id="purchase.isLegacy" m="Use Legacy VSP" />}
                className={styles.useLegacyLabel}
                id="box"
                checked={false}
                onChange={() => toggleIsLegacy(true)}
              />
            </Tooltip>
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
      <div className={classNames(styles.isRow, styles.inputAmount)}>
        <label className={styles.rowLabel}>
          <T id="purchaseTickets.ticketAmount" m="Amount" />
          <NumTicketsInput
            required
            invalid={account.spendable < numTicketsToBuy * ticketPrice}
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
            showErrors={true}
          />
        </label>
        {account.spendable >= numTicketsToBuy * ticketPrice && (
          <div className={styles.inputValidMessageArea}>
            <span>
              <T id="purchaseTickets.vspFee" m="VSP Fee" />:
            </span>
            <span
              className={classNames(styles.vspFee, vsp && styles.haveVspFee)}>
              {vsp && vspFee ? vspFee : 0} %
            </span>
            <T
              id="purchaseTickets.validMsg"
              m="Total: {amount} Remaining: {remaining}"
              values={{
                amount: (
                  <Balance
                    flat
                    amount={numTicketsToBuy * ticketPrice}
                    classNameWrapper={styles.validMsgBalance}
                    classNameSecondary={styles.validMsgBalanceSecondary}
                    classNameUnit={styles.validMsgBalanceUnit}
                  />
                ),
                remaining: (
                  <Balance
                    flat
                    amount={account.spendable - numTicketsToBuy * ticketPrice}
                    classNameWrapper={styles.validMsgBalance}
                    classNameSecondary={styles.validMsgBalanceSecondary}
                    classNameUnit={styles.validMsgBalanceUnit}
                  />
                )
              }}
            />
          </div>
        )}
      </div>
    </div>
    <div className={styles.buttonsArea}>
      <RevokeModalButton
        modalTitle={
          <T id="tickets.revokeConfirmations" m="Revoke Tickets Confirmation" />
        }
        className={styles.revokeButton}
        onSubmit={onRevokeTickets}
        kind="secondary"
        buttonLabel={<T id="purchaseTickets.revokeBtn" m="Revoke" />}
      />
      {isWatchingOnly ? (
        <PiUiButton disabled={!isValid} onClick={onPurchaseTicket}>
          {purchaseLabel()}
        </PiUiButton>
      ) : isLoading ? (
        <PiUiButton disabled={true} loading={true} />
      ) : getRunningIndicator ? (
        <Tooltip
          content={
            <T
              id="tickets.purchase.running"
              m="Privacy Mixer or Autobuyer running, please shut them off before purchasing a ticket."
            />
          }>
          <PiUiButton disabled={true} buttonLabel={purchaseLabel()} />
        </Tooltip>
      ) : (
        <TicketPurchaseModalButton
          modalTitle={
            <T
              id="tickets.purchaseConfirmation"
              m="Ticket Purchase Confirmation"
            />
          }
          disabled={!isValid}
          onSubmit={onPurchaseTicket}
          buttonLabel={purchaseLabel()}
        />
      )}
    </div>
  </>
);

export default PurchaseTicketsForm;
