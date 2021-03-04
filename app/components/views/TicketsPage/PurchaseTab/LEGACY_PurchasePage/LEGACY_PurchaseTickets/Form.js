import {
  TicketsCogs,
  PassphraseModalButton,
  ImportScriptIconButton,
  KeyBlueButton,
  InvisibleConfirmModalButton
} from "buttons";
import { AccountsSelect, NumTicketsInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import {
  TransitionMotionWrapper,
  ShowWarning,
  ExternalLink,
  Balance
} from "shared";

import "style/StakePool.less";

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
    <div className="purchase-ticket-area-row is-row">
      <div className="is-row purchase-ticket-input-address">
        <div className="purchase-ticket-area-row-label">
          <T id="purchaseTickets.accountFrom.legacy" m="From" />:
        </div>
        <AccountsSelect
          className="stakepool-purchase-ticket-input-select"
          filterAccounts={notMixedAccounts}
          {...{ account, onChange: onChangeAccount }}
        />
        <div className="stakepool-info-icon account-select-icon"></div>
      </div>
      <div className="is-row purchase-ticket-input-amount">
        <div className="purchase-ticket-area-row-label">
          <T id="purchaseTickets.ticketAmount.legacy" m="Amount" />:
        </div>
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
          showErrors={true}></NumTicketsInput>
        {getIsValid() && (
          <div className="input-purchase-ticket-valid-message-area">
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
    <div className="stakepool-purchase-ticket-info">
      <div className="purchase-ticket-action-buttons is-column">
        <TicketsCogs
          opened={!isShowingAdvanced}
          onClick={onToggleShowAdvanced}
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
      <div className="warning-area">
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
        <div className="is-row backup-buttons-row-area">
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
            className="stakepool-content-send"
          />
          <KeyBlueButton
            className="vsp-warning-backup-redeem-button"
            onClick={() => toggleShowVsp(true)}>
            <T id="purchase.ticket.warn.button" m="Backup Redeem Scripts" />
          </KeyBlueButton>
        </div>
      </div>
    )}
    <div className="stakepool-purchase-ticket-buttons-area">
      <PassphraseModalButton
        modalTitle={
          <T
            id="tickets.revokeConfirmations.legacy"
            m="Revoke Tickets Confirmation"
          />
        }
        className="stakepool-content-revoke-button"
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
        <KeyBlueButton
          modalTitle={
            <T
              id="tickets.purchaseConfirmation.legacy"
              m="Ticket Purchase Confirmation"
            />
          }
          disabled={getIsValid && !getIsValid()}
          onSubmit={onPurchaseTickets}>
          {purchaseLabel()}
        </KeyBlueButton>
      )}
    </div>
  </>
);

export default PurchaseTicketsForm;
