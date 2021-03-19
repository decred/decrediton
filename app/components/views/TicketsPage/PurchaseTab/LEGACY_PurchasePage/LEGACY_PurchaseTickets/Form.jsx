import {
  TicketsCogs,
  PassphraseModalButton,
  ImportScriptIconButton,
  KeyBlueButton,
  InvisibleConfirmModalButton
} from "buttons";
import { AccountsSelect, NumTicketsInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import { Tooltip, classNames } from "pi-ui";
import {
  TransitionMotionWrapper,
  ShowWarning,
  ExternalLink,
  Balance
} from "shared";

import styles from "./PurchaseTickets.module.css";

const purchaseLabel = () => (
  <T id="purchas.legacypurchaseTickets.purchaseBtn" m="Purchase" />
);

const PurchaseTicketsForm = ({
  isShowingAdvanced,
  getQuickBarComponent,
  getAdvancedComponent,
  getIsValid,
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
  isWatchingOnly,
  notMixedAccounts,
  getRunningIndicator
}) => (
  <>
    <div className={classNames(styles.areaRow, styles.isRow)}>
      <div className={classNames(styles.isRow, styles.inputAddress)}>
        <label className={styles.rowLabel}>
          <T id="purchaseTickets.accountFrom.legacy" m="From" />:
        </label>
        <AccountsSelect
          className={styles.inputSelect}
          filterAccounts={notMixedAccounts}
          {...{ account, onChange: onChangeAccount }}
        />
        <div
          className={classNames(styles.infoIcon, styles.accountSelectIcon)}
        />
      </div>
      <div className={classNames(styles.isRow, styles.inputAmount)}>
        <label className={styles.rowLabel} htmlFor="numTicketsToBuy">
          <T id="purchaseTickets.ticketAmount.legacy" m="Amount" />:
        </label>
        <NumTicketsInput
          required
          invalid={!getIsValid()}
          invalidMessage={
            <T
              id="purchaseTickets.errors.insufficientBalance.legacy"
              m="Not enough funds"
            />
          }
          numTickets={numTicketsToBuy}
          incrementNumTickets={onIncrementNumTickets}
          decrementNumTickets={onDecrementNumTickets}
          onChangeNumTickets={onChangeNumTickets}
          onKeyDown={handleOnKeyDown}
          id="numTicketsToBuy"
          showErrors={true}></NumTicketsInput>
        {getIsValid() && (
          <div className={styles.inputValidMessageArea}>
            <T
              id="purchaseTickets.validMsg.legacy"
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
    {!dismissBackupRedeemScript && (
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
        <div className={classNames(styles.isRow, styles.backupButtonsRowArea)}>
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
      <PassphraseModalButton
        modalTitle={
          <T
            id="tickets.revokeConfirmations.legacy"
            m="Revoke Tickets Confirmation"
          />
        }
        className={styles.revokeButton}
        onSubmit={onRevokeTickets}
        buttonLabel={<T id="purchaseTickets.revokeBtn.legacy" m="Revoke" />}
      />
      {isWatchingOnly ? (
        <KeyBlueButton
          disabled={getIsValid && !getIsValid()}
          onClick={onPurchaseTickets}>
          {purchaseLabel()}
        </KeyBlueButton>
      ) : getRunningIndicator ? (
        <Tooltip
          content={
            <T
              id="tickets.purchase-legacy.running"
              m="Privacy Mixer or Autobuyer running, please shut them off before purchasing tickets."
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
              id="tickets.purchaseConfirmation.legacy"
              m="Ticket Purchase Confirmation"
            />
          }
          disabled={getIsValid && !getIsValid()}
          onSubmit={onPurchaseTickets}
          buttonLabel={purchaseLabel()}
        />
      )}
    </div>
  </>
);

export default PurchaseTicketsForm;
