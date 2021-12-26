import { FormattedMessage as T, defineMessages } from "react-intl";
import { classNames, Checkbox, Tooltip } from "pi-ui";
import {
  TicketPurchaseModalButton,
  RevokeModalButton,
  PiUiButton,
  TicketsCogs,
  ImportScriptIconButton,
  KeyBlueButton,
  InvisibleConfirmModalButton
} from "buttons";
import { AccountsSelect, NumTicketsInput, VSPSelect } from "inputs";
import {
  TransitionMotionWrapper,
  ShowWarning,
  ExternalLink,
  Balance
} from "shared";
import styles from "./PurchaseTicketsForm.module.css";
import { useIntl } from "react-intl";

const purchaseLabel = () => <T id="purchaseTickets.purchaseBtn" m="Purchase" />;
const revokeLabel = () => <T id="purchaseTickets.revokeBtn" m="Revoke" />;

const messages = defineMessages({
  insufficientBalanceErrorMsg: {
    id: "purchaseTickets.errors.insufficientBalance",
    defaultMessage: "Not enough funds"
  }
});

const PurchaseTicketsForm = ({
  spvMode,
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
  onRevokeTickets,
  availableVSPs,
  isLoading,
  rememberedVspHost,
  toggleRememberVspHostCheckBox,
  notMixedAccounts,
  getRunningIndicator,
  isLegacy,
  dismissBackupRedeemScript,
  onDismissBackupRedeemScript,
  isShowingAdvanced,
  onToggleShowAdvanced,
  getQuickBarComponent,
  getAdvancedComponent,
  willEnter,
  willLeave,
  toggleShowVsp
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
          {!isLegacy && (
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
          )}
          <div className={styles.checkboxWrapper}>
            {vsp && !isLegacy && (
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
      {isLegacy && (
        <div className={styles.info}>
          <div className={classNames(styles.actionButtons, styles.isColumn)}>
            <TicketsCogs
              opened={!isShowingAdvanced}
              onClick={onToggleShowAdvanced}
              ariaLabel="Show advanced settings"
            />
            <ImportScriptIconButton />
          </div>
          <TransitionMotionWrapper
            {...{
              styles: !isShowingAdvanced
                ? getQuickBarComponent
                : getAdvancedComponent,
              willEnter: !isShowingAdvanced
                ? () => willEnter(270)
                : () => willEnter(80),
              willLeave
            }}
          />
        </div>
      )}
      {!dismissBackupRedeemScript && isLegacy && (
        <div className={styles.warningArea}>
          <ShowWarning
            warn={
              <T
                id="purchase.ticket.backup.redeem.warn"
                m="You must backup your redeem script. More information about it can be found at {link}"
                values={{
                  link: (
                    <ExternalLink
                      href={
                        "https://docs.decred.org/wallets/decrediton/using-decrediton/#backup-redeem-script"
                      }>
                      <T id="purchase.ticket.decred.docs" m="Decred docs" />
                    </ExternalLink>
                  )
                }}
              />
            }
          />
          <div
            className={classNames(styles.isRow, styles.backupButtonsRowArea)}>
            <InvisibleConfirmModalButton
              modalTitle={<T id="purchase.ticket.modal.title" m="Dismiss" />}
              modalContent={
                <T
                  id="purchase.ticket.modal.desc"
                  m="Are you sure you want to dismiss this message? Make sure your redeem scripts are backed up."
                />
              }
              buttonLabel={
                <T id="purchase.ticket.dismiss.warn" m="Dismiss Message" />
              }
              onSubmit={() => onDismissBackupRedeemScript()}
              className={styles.stakepoolContentSend}
            />
            <KeyBlueButton
              className={styles.vspWarningBackupRedeemButton}
              onClick={() => toggleShowVsp(true)}>
              <T id="purchase.ticket.warn.button" m="Backup Redeem Scripts" />
            </KeyBlueButton>
          </div>
        </div>
      )}
      <div className={styles.buttonsArea}>
        {getRunningIndicator ? (
          <Tooltip
            contentClassName={styles.disabledTooltip}
            content={
              <T
                id="tickets.revoke.running"
                m="Privacy Mixer or Autobuyer running, please shut them off before revoking tickets."
              />
            }>
            <PiUiButton disabled={true} className={styles.revokeButton}>
              {revokeLabel()}
            </PiUiButton>
          </Tooltip>
        ) : (
          !spvMode && (
            <RevokeModalButton
              modalTitle={
                <T
                  id="tickets.revokeConfirmations"
                  m="Revoke Tickets Confirmation"
                />
              }
              className={styles.revokeButton}
              onSubmit={onRevokeTickets}
              kind="secondary"
              buttonLabel={revokeLabel()}
            />
          )
        )}

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
