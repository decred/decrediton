import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import { AccountsSelect, DcrInput, ReceiveAccountsSelect } from "inputs";
import { Balance } from "shared";
import styles from "./SendOutputRow.module.css";

const messages = defineMessages({
  destinationAddrPlaceholder: {
    id: "send.destinationAddrPlaceholder",
    defaultMessage: "Address"
  },
  amountPlaceholder: {
    id: "send.amountPlaceholder",
    defaultMessage: "Amount"
  }
});

const getSendAllFundsIcon = ({
  isSendAll,
  onShowSendAll,
  onHideSendAll,
  outputs
}) => (
  <div className={styles.sendAllFundsIcon}>
    {outputs.length > 1 ? (
      <Tooltip
        contentClassName={styles.tooltipSendAllDisabled}
        content={
          <T
            id="send.sendAllTitle.disabled"
            m="Send all funds from selected account - Disabled"
          />
        }>
        <a
          className={classNames(
            styles.sendIconWrapper,
            styles.walletIcon,
            styles.disabled
          )}
        />
      </Tooltip>
    ) : !isSendAll ? (
      <Tooltip
        contentClassName={styles.tooltipSendAll}
        content={
          <T id="send.sendAllTitle" m="Send all funds from selected account" />
        }>
        <a
          className={classNames(styles.sendIconWrapper, styles.walletIcon)}
          onClick={onShowSendAll}
        />
      </Tooltip>
    ) : (
      <Tooltip
        contentClassName={styles.tooltipSendAllDisabled}
        content={
          <T id="send.cancelSendAllTitle" m="Cancel sending all funds" />
        }>
        <a
          className={classNames(styles.sendIconWrapper, styles.cancelIcon)}
          onClick={onHideSendAll}
        />
      </Tooltip>
    )}
  </div>
);

const SendOutputRow = ({
  index,
  amount,
  onValidateAmount,
  isSendAll,
  onKeyDown,
  sendAllAmount,
  error,
  intl,
  onShowSendAll,
  onHideSendAll,
  outputs,
  onChangeAccount,
  account,
  filterAccounts,
  accountsType,
  receiveAccountsSelectDisabled,
  receiveAccount
}) => (
  <div className={classNames(styles.sendOutputContainer)}>
    {index === 0 && (
      <>
        <label>
          <T id="send.from" m="From" />:
        </label>
        <div className={styles.sendInputWrapper}>
          <AccountsSelect
            {...{
              account,
              filterAccounts,
              onChange: onChangeAccount,
              onKeyDown,
              accountsType
            }}
          />
        </div>
      </>
    )}
    <label>
      <T id="send.to" m="To" />:
    </label>
    <div className={styles.sendInputWrapper}>
      <ReceiveAccountsSelect
        isDisabled={receiveAccountsSelectDisabled}
        showAccountsButton={false}
        onKeyDown={onKeyDown}
        account={receiveAccount}
      />
    </div>
    <label htmlFor="amountInput">
      <T id="send.amount" m="Amount" />:
    </label>
    <div
      className={classNames(
        styles.sendInputWrapper,
        styles.amountInputWrapper
      )}>
      {isSendAll ? (
        <Balance
          classNameWrapper={styles.sendAll}
          flat
          amount={sendAllAmount}
        />
      ) : (
        <DcrInput
          id="amountInput"
          className={classNames(styles.dcrInput)}
          required={true}
          showErrors={error && error.amount}
          invalid={error && error.amount}
          invalidMessage={error && error.amount}
          amount={amount}
          placeholder={intl.formatMessage(messages.amountPlaceholder)}
          onChangeAmount={(e) =>
            onValidateAmount({ index, atomValue: e.atomValue })
          }
          onKeyDown={onKeyDown}
        />
      )}
    </div>
    {index === 0 &&
      getSendAllFundsIcon({
        isSendAll,
        onShowSendAll,
        onHideSendAll,
        outputs
      })}
  </div>
);

export default injectIntl(SendOutputRow);
