import { FormattedMessage as T, defineMessages } from "react-intl";
import { classNames, Checkbox, Tooltip } from "pi-ui";
import { TicketPurchaseModalButton, PiUiButton } from "buttons";
import { AccountsSelect, NumTicketsInput, VSPSelect } from "inputs";
import { Balance } from "shared";
import styles from "./PurchaseTicketsForm.module.css";
import { useIntl } from "react-intl";

const purchaseLabel = () => <T id="purchaseTickets.purchaseBtn" m="Purchase" />;

const messages = defineMessages({
  insufficientBalanceErrorMsg: {
    id: "purchaseTickets.errors.insufficientBalance",
    defaultMessage: "Not enough funds"
  }
});

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
  onPurchaseTickets,
  availableVSPs,
  isLoading,
  rememberedVspHost,
  toggleRememberVspHostCheckBox,
  notMixedAccounts,
  getRunningIndicator
}) => {
  const intl = useIntl();
  return (
    <>
      <div className={classNames(styles.purchaseForm, styles.isRow)}>
        <div className={classNames(styles.isColumn, styles.inputAddress)}>
          <label className={styles.rowLabel}>
            <T id="purchaseTickets.accountFrom" m="Account" />
            <div className={styles.inputSelectContainer}>
              <AccountsSelect
                selectWithBigFont
                filterAccounts={notMixedAccounts}
                className={styles.inputSelect}
                selectClassName={styles.accountSelectInput}
                {...{ account, onChange: setAccount }}
              />
            </div>
          </label>
          <label className={styles.rowLabel}>
            <T id="purchaseTickets.vspFrom" m="VSP" />
            <div className={styles.vspContainer}>
              <VSPSelect
                selectWithBigFont
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
          <div className={styles.numTicketsToBuy}>
            <label htmlFor="numTicketsToBuy">
              <T id="purchaseTickets.ticketAmount" m="Amount" />
            </label>
            <NumTicketsInput
              required
              invalid={account.spendable < numTicketsToBuy * ticketPrice}
              invalidMessage={intl.formatMessage(
                messages.insufficientBalanceErrorMsg
              )}
              numTickets={numTicketsToBuy}
              incrementNumTickets={onIncrementNumTickets}
              decrementNumTickets={onDecrementNumTickets}
              onChangeNumTickets={onChangeNumTickets}
              onKeyDown={handleOnKeyDown}
              id="numTicketsToBuy"
              showErrors={true}
            />
          </div>
          {isValid && (
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
        {isWatchingOnly ? (
          <PiUiButton disabled={!isValid} onClick={onPurchaseTickets}>
            {purchaseLabel()}
          </PiUiButton>
        ) : isLoading ? (
          <PiUiButton loading={true}>
            <div />
          </PiUiButton>
        ) : getRunningIndicator ? (
          <Tooltip
            contentClassName={styles.disabledTooltip}
            content={
              <T
                id="tickets.purchase.running"
                m="Privacy Mixer or Autobuyer running, please shut them off before purchasing a ticket."
              />
            }>
            <PiUiButton disabled={true}>{purchaseLabel()}</PiUiButton>
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
            modalClassName={styles.passphraseModal}
            onSubmit={onPurchaseTickets}
            buttonLabel={purchaseLabel()}
          />
        )}
      </div>
    </>
  );
};

export default PurchaseTicketsForm;
