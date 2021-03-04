import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import {
  AccountsSelect,
  AddressInput,
  DcrInput,
  ReceiveAccountsSelect
} from "inputs";
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
  outputs,
  extStyle
}) => (
  <div className={extStyle.sendAllFundsIcon}>
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

const getAddInputIcon = ({
  isSendSelf,
  onAddOutput,
  onRemoveOutput,
  index,
  isSendAll
}) =>
  isSendSelf ? (
    <div
      className={classNames(
        styles.sendIconWrapper,
        styles.add,
        styles.disabled
      )}></div>
  ) : (
    !isSendAll &&
    (index === 0 ? (
      <div
        className={classNames(styles.sendIconWrapper, styles.add)}
        onClick={onAddOutput}></div>
    ) : (
      <div
        className={classNames(styles.sendIconWrapper, styles.delete)}
        onClick={() => onRemoveOutput(index)}></div>
    ))
  );

const getSendSelfIcon = ({ isSendSelf, onShowSendSelf, onShowSendOthers }) =>
  !isSendSelf ? (
    <Tooltip
      contentClassName={styles.tooltipSendToSelf}
      content={<T id="send.sendSelfTitle" m="Send funds to another account" />}>
      <a
        className={classNames(styles.sendIconWrapper, styles.selfAccountIcon)}
        onClick={onShowSendSelf}
      />
    </Tooltip>
  ) : (
    <Tooltip
      contentClassName={styles.tooltipSendAllDisabled}
      content={
        <T id="send.sendOthersTitle" m="Send funds to another wallet" />
      }>
      <a
        className={classNames(styles.sendIconWrapper, styles.cancelIcon)}
        onClick={onShowSendOthers}
      />
    </Tooltip>
  );

const SendOutputRow = ({
  index,
  destination,
  amount,
  onAddOutput,
  onRemoveOutput,
  onValidateAmount,
  onValidateAddress,
  isSendAll,
  onKeyDown,
  sendAllAmount,
  error,
  intl,
  onShowSendAll,
  onHideSendAll,
  isSendSelf,
  outputs,
  onChangeAccount,
  onShowSendSelf,
  account,
  onShowSendOthers,
  filterAccounts,
  accountsType,
  onlySendSelfAllowed,
  receiveAccountsSelectDisabled,
  extStyle,
  receiveAccount
}) => (
  <div
    className={classNames(
      extStyle.sendOutputContainer,
      index > 0 && extStyle.plus
    )}>
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
        {!onlySendSelfAllowed &&
          getSendSelfIcon({ isSendSelf, onShowSendSelf, onShowSendOthers })}
      </>
    )}
    <label>
      <T id="send.to" m="To" />:
    </label>
    <div className={styles.sendInputWrapper}>
      {isSendSelf ? (
        <ReceiveAccountsSelect
          disabled={receiveAccountsSelectDisabled}
          getAddressForSelected={true}
          showAccountsButton={false}
          onKeyDown={onKeyDown}
          account={receiveAccount}
        />
      ) : (
        <AddressInput
          required={true}
          autoFocus={index === 0}
          showErrors={error && error.address}
          invalid={error && error.address}
          invalidMessage={error && error.address}
          value={destination}
          placeholder={intl.formatMessage(messages.destinationAddrPlaceholder)}
          onChange={(e) =>
            onValidateAddress({ address: e.target.value, index })
          }
          onKeyDown={onKeyDown}
        />
      )}
    </div>
    {!onlySendSelfAllowed &&
      getAddInputIcon({
        isSendSelf,
        onAddOutput,
        onRemoveOutput,
        index,
        isSendAll
      })}
    <label>
      <T id="send.amount" m="Amount" />:
    </label>
    <div
      className={classNames(
        styles.sendInputWrapper,
        extStyle.amountInputWrapper
      )}>
      {isSendAll ? (
        <Balance
          classNameWrapper={styles.sendAll}
          flat
          amount={sendAllAmount}
        />
      ) : (
        <DcrInput
          className={classNames(extStyle.dcrInput)}
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
        outputs,
        extStyle
      })}
  </div>
);

export default injectIntl(SendOutputRow);
