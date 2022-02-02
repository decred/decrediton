import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { classNames } from "pi-ui";
import {
  AccountsSelect,
  AddressInput,
  DcrInput,
  ReceiveAccountsSelect
} from "inputs";
import { Balance } from "shared";
import styles from "./SendOutputRow.module.css";
import SendAllFundsIcon from "./SendAllFundsIcon";

const messages = defineMessages({
  destinationAddrPlaceholder: {
    id: "send.dex.destinationAddrPlaceholder",
    defaultMessage: "Address"
  },
  amountPlaceholder: {
    id: "send.dex.amountPlaceholder",
    defaultMessage: "Amount"
  }
});

const SendOutputRow = ({
  index,
  destination,
  amount,
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
          <T id="send.dex.from" m="From" />:
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
      <T id="send.dex.to" m="To" />:
    </label>
    <div className={styles.sendInputWrapper}>
      {isSendSelf ? (
        <ReceiveAccountsSelect
          isDisabled={receiveAccountsSelectDisabled}
          showAccountsButton={false}
          onKeyDown={onKeyDown}
          account={receiveAccount}
        />
      ) : (
        <AddressInput
          id="addressInput"
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
    <label>
      <T id="send.dex.amount" m="Amount" />:
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
    {index === 0 && (
      <SendAllFundsIcon
        {...{
          isSendAll,
          onShowSendAll,
          onHideSendAll,
          outputs
        }}
      />
    )}
  </div>
);

export default injectIntl(SendOutputRow);
