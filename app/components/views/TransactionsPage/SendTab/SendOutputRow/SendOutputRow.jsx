import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import {
  AccountsSelect,
  AddressInput,
  DcrInput,
  ReceiveAccountsSelect
} from "inputs";
import { Tooltip, Balance } from "shared";
import { classNames } from "pi-ui";
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
}) =>
  outputs.length > 1 ? (
    <Tooltip
      text={
        <T
          id="send.sendAllTitle.disabled"
          m="Send all funds from selected account - Disabled"
        />
      }>
      <a className={classNames(
        styles.sendIconWrapper,
        styles.walletIcon,
        styles.disabled
      )}/>
    </Tooltip>
  ) : !isSendAll ? (
    <Tooltip
      text={
        <T id="send.sendAllTitle" m="Send all funds from selected account" />
      }>
      <a className={classNames(
        styles.sendIconWrapper,
        styles.walletIcon
      )} onClick={onShowSendAll} />
    </Tooltip>
  ) : (
    <Tooltip
      text={<T id="send.cancelSendAllTitle" m="Cancel sending all funds" />}>
      <a className={classNames(
        styles.sendIconWrapper,
        styles.cancelIcon
      )} onClick={onHideSendAll} s/>
    </Tooltip>
  );

const getAddInputIcon = ({
  isSendSelf,
  onAddOutput,
  onRemoveOutput,
  index,
  isSendAll
}) =>
  isSendSelf ? (
    <div className={classNames(
      styles.sendIconWrapper,
      styles.add,
      styles.disabled
    )}></div>
  ) : (
    !isSendAll &&
    (index === 0 ? (
      <div className={classNames(
        styles.sendIconWrapper,
        styles.add
      )}onClick={onAddOutput}></div>
    ) : (
      <div
        className={classNames(styles.sendIconWrapper, styles.delete)}
        onClick={() => onRemoveOutput(index)}></div>
    ))
  );

const getSendSelfIcon = ({ isSendSelf, onShowSendSelf, onShowSendOthers }) =>
  !isSendSelf ? (
    <Tooltip
      text={<T id="send.sendSelfTitle" m="Send funds to another account" />}>
      <a
        className={classNames(styles.sendIconWrapper, styles.selfAccountIcon)}
        onClick={onShowSendSelf}
      />
    </Tooltip>
  ) : (
    <Tooltip
      text={<T id="send.sendOthersTitle" m="Send funds to another wallet" />}>
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
  accountsType
}) => (
  <div className={styles.isRow}>
    <div>
      {index === 0 && (
        <div className={styles.sendLabel}>
          <T id="send.from" m="From" />:
        </div>
      )}
      <div className={styles.sendLabel}>
        <span>
          <T id="send.to" m="To" />:
        </span>
      </div>
      <div className={styles.sendLabel}>
        <span>
          <T id="send.amount" m="Amount" />:
        </span>
      </div>
    </div>
    <div>
      {index === 0 && (
        <div className={styles.sendInputWrapper}>
          <AccountsSelect
            className={styles.sendInput}
            {...{
              account,
              filterAccounts,
              onChange: onChangeAccount,
              onKeyDown,
              accountsType
            }}
          />
        </div>
      )}
      <div className={styles.sendInputWrapper}>
        {isSendSelf ? (
          <ReceiveAccountsSelect
            className={styles.sendInput}
            getAddressForSelected={true}
            showAccountsButton={false}
            onKeyDown={onKeyDown}
          />
        ) : (
          <AddressInput
            className={styles.sendInput}
            required={true}
            autoFocus={index === 0}
            showErrors={error && error.address}
            invalid={error && error.address}
            invalidMessage={error && error.address}
            value={destination}
            placeholder={intl.formatMessage(
              messages.destinationAddrPlaceholder
            )}
            onChange={(e) =>
              onValidateAddress({ address: e.target.value, index })
            }
            onKeyDown={onKeyDown}
          />
        )}
      </div>
      <div className={styles.sendInputWrapper}>
        {isSendAll ? (
          <Balance
            classNameWrapper={classNames(styles.sendInput, styles.sendAll)}
            flat
            amount={sendAllAmount}
          />
        ) : (
          <DcrInput
            className={styles.sendInput}
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
    </div>
    <div className={styles.isColumn}>
      {index === 0 &&
        getSendSelfIcon({ isSendSelf, onShowSendSelf, onShowSendOthers })}
      {getAddInputIcon({
        isSendSelf,
        onAddOutput,
        onRemoveOutput,
        index,
        isSendAll
      })}
      {index === 0 &&
        getSendAllFundsIcon({
          isSendAll,
          onShowSendAll,
          onHideSendAll,
          outputs
        })}
    </div>
  </div>
);

export default injectIntl(SendOutputRow);
