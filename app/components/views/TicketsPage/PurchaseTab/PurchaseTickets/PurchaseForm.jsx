import { FormattedMessage as T } from "react-intl";
import { classNames, Checkbox, Tooltip } from "pi-ui";
import { PassphraseModalButton, KeyBlueButton } from "buttons";
import { AccountsSelect, NumTicketsInput, VSPSelect } from "inputs";
import { Balance } from "shared";
import styles from "../PurchaseTab.module.css";

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
  notMixedAccounts,
  getRunningIndicator
}) => (
  <>
    <div className={classNames(styles.purchaseForm, styles.isRow)}>
      <div className={classNames(styles.isColumn, styles.inputAddress)}>
        <label className={styles.rowLabel}>
          <T id="purchaseTickets.accountFrom" m="Account" />:
          <div className={styles.inputSelectContainer}>
            <AccountsSelect
              filterAccounts={notMixedAccounts}
              className={styles.inputSelect}
              {...{ account, onChange: setAccount }}
            />
          </div>
        </label>
        <label className={styles.rowLabel}>
          <T id="purchaseTickets.vspFrom" m="VSP" />:
          <div className={styles.vspContainer}>
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
      <div className={classNames(styles.isRow, styles.inputAmount)}>
        <label className={styles.rowLabel}>
          <T id="purchaseTickets.ticketAmount" m="Amount" />:
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
        </label>
        {account.spendable >= numTickets * ticketPrice && (
          <div className={styles.inputValidMessageArea}>
            {vsp && (
              <>
                <span>
                  <T id="purchaseTickets.vspFee" m="VSP Fee" />:
                </span>
                <span className={styles.vspFee}>{vspFee} %</span>
              </>
            )}
            <T
              id="purchaseTickets.validMsg"
              m="Total: {amount} Remaining: {remaining}"
              values={{
                amount: (
                  <Balance
                    flat
                    amount={numTickets * ticketPrice}
                    classNameWrapper={styles.validMsgBalance}
                    classNameSecondary={styles.validMsgBalanceSecondary}
                    classNameUnit={styles.validMsgBalanceUnit}
                  />
                ),
                remaining: (
                  <Balance
                    flat
                    amount={account.spendable - numTickets * ticketPrice}
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
    <div className={styles.info}>
      <div className={classNames(styles.actionButtons, styles.isColumn)} />
      {/* ADD VSP INFO HERE */}
    </div>
    <div className={styles.buttonsArea}>
      <PassphraseModalButton
        modalTitle={
          <T id="tickets.revokeConfirmations" m="Revoke Tickets Confirmation" />
        }
        className={styles.revokeButton}
        onSubmit={onRevokeTickets}
        buttonLabel={<T id="purchaseTickets.revokeBtn" m="Revoke" />}
      />
      {isWatchingOnly ? (
        <KeyBlueButton disabled={!isValid} onClick={onV3PurchaseTicket}>
          {purchaseLabel()}
        </KeyBlueButton>
      ) : isLoading ? (
        <KeyBlueButton disabled={true} loading={true} />
      ) : getRunningIndicator ? (
        <Tooltip
          content={
            <T
              id="tickets.purchase.running"
              m="Privacy Mixer or Autobuyer running, please shut them off before purchasing a ticket."
            />
          }>
          <PassphraseModalButton
            disabled={true}
            buttonLabel={purchaseLabel()}
          />
        </Tooltip>
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
