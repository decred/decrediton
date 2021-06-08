import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { classNames, Tooltip, Button } from "pi-ui";
import { wallet } from "wallet-preload-shim";
import {
  DetailedAccountsSelect,
  AddressInput,
  DcrInput,
  ReceiveAccountsSelect
} from "inputs";
import { SmallButton } from "buttons";
import { Balance } from "shared";
import styles from "./SendOutputRow.module.css";

const messages = defineMessages({
  destinationAddrPlaceholder: {
    id: "sendtab.recipientsAddrPlaceholder",
    defaultMessage: "Recipient’s DCR Address"
  },
  amountPlaceholder: {
    id: "sendtab.amountPlaceholder",
    defaultMessage: "Amount"
  },
  amountLabel: {
    id: "sendtab.amountLabel",
    defaultMessage: "Amount"
  },
  addressLabel: {
    id: "sendtab.addressLabel",
    defaultMessage: "Send to"
  }
});

const getSendAllFundsIcon = ({
  isSendAll,
  onShowSendAll,
  onHideSendAll,
  outputs
}) => (
  <div>
    {outputs.length > 1 ? (
      <Tooltip
        contentClassName={styles.tooltipSendAllDisabled}
        content={
          <T
            id="sendtab.sendAllTitle.disabled"
            m="Send all funds from selected account - Disabled"
          />
        }>
        <SmallButton className={styles.sendAllButton} disabled />
      </Tooltip>
    ) : !isSendAll ? (
      <Tooltip
        contentClassName={styles.tooltipSendAll}
        content={
          <T
            id="sendtab.sendAllTitle"
            m="Send all funds from selected account"
          />
        }>
        <SmallButton className={styles.sendAllButton} onClick={onShowSendAll} />
      </Tooltip>
    ) : (
      <Tooltip
        contentClassName={styles.tooltipSendAllDisabled}
        content={
          <T id="sendtab.cancelSendAllTitle" m="Cancel sending all funds" />
        }>
        <SmallButton className={styles.cancelSendAll} onClick={onHideSendAll} />
      </Tooltip>
    )}
  </div>
);

const getAddInputIcon = ({
  isSendSelf,
  onAddOutput,
  onRemoveOutput,
  index,
  isSendAll,
  onlySendSelfAllowed
}) =>
  isSendSelf || onlySendSelfAllowed || isSendAll ? (
    <Tooltip
      contentClassName={styles.tooltipAddInput}
      content={<T id="sendtab.addOutput" m="Add output" />}>
      <Button onClick={onAddOutput} className={styles.add} disabled>
        <div />
      </Button>
    </Tooltip>
  ) : index === 0 ? (
    <Tooltip
      contentClassName={styles.tooltipAddInput}
      content={<T id="sendtab.addOutput" m="Add output" />}>
      <Button onClick={onAddOutput} className={styles.add}>
        <div />
      </Button>
    </Tooltip>
  ) : (
    <Tooltip
      contentClassName={styles.tooltipDeleteInput}
      content={<T id="sendtab.deleteOutput" m="Delete output" />}>
      <Button onClick={() => onRemoveOutput(index)} className={styles.delete}>
        <div />
      </Button>
    </Tooltip>
  );

const getSendSelfIcon = ({ isSendSelf, onShowSendSelf, onShowSendOthers }) =>
  !isSendSelf ? (
    <Tooltip
      contentClassName={styles.tooltipSendToSelf}
      content={
        <T id="sendtab.sendSelfTitle" m="Send funds to another account" />
      }>
      <SmallButton className={styles.selfAccount} onClick={onShowSendSelf} />
    </Tooltip>
  ) : (
    <Tooltip
      contentClassName={styles.tooltipSendAllDisabled}
      content={
        <T id="sendtab.sendOthersTitle" m="Send funds to another wallet" />
      }>
      <SmallButton
        className={styles.selfAccountCancel}
        onClick={onShowSendOthers}
      />
    </Tooltip>
  );

const getPercentOfAmount = ({ account, amount, isSendAll }) => {
  if (isSendAll) {
    return 100;
  }
  if (!amount || amount <= 0) {
    return 0;
  }
  if (account && account.spendable && account.spendable > 0) {
    return ((amount / account.spendable) * 100).toFixed(2);
  }
  return 0;
};

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
  receiveAccount
}) => {
  const percentOfBalance = getPercentOfAmount({ account, amount, isSendAll });
  return (
    <div
      className={classNames(
        styles.sendOutputContainer,
        index > 0 && styles.plus
      )}>
      {index === 0 && (
        <>
          <div className={classNames(styles.sendInputWrapper, styles.from)}>
            <DetailedAccountsSelect
              {...{
                account,
                filterAccounts,
                onChange: onChangeAccount,
                onKeyDown,
                accountsType
              }}
            />
            <div className={styles.sendIcons}>
              {index === 0 &&
                getSendAllFundsIcon({
                  isSendAll,
                  onShowSendAll,
                  onHideSendAll,
                  outputs
                })}
              {!onlySendSelfAllowed &&
                getSendSelfIcon({
                  isSendSelf,
                  onShowSendSelf,
                  onShowSendOthers
                })}
            </div>
          </div>
        </>
      )}
      {isSendAll && (
        <label
          htmlFor={`amountInput-${index}`}
          className={styles.amountInputLabel}>
          <T id="sendtab.sendAllAmountLabel" m="Amount" />
        </label>
      )}
      <div
        className={classNames(
          styles.amountContainer,
          isSendAll && styles.sendAllContainer
        )}>
        <div className={styles.sendInputWrapper}>
          {isSendAll ? (
            <Balance
              id={`amountInput-${index}`}
              classNameWrapper={styles.sendAll}
              flat
              amount={sendAllAmount}
            />
          ) : (
            <DcrInput
              id={`amountInput-${index}`}
              newBiggerFontStyle
              label={intl.formatMessage(messages.amountLabel)}
              className={styles.dcrInput}
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
        <div
          className={classNames(
            styles.percentOfBalance,
            percentOfBalance > 100 && styles.error
          )}>
          <T
            id="sendtab.percentOfBalance"
            m="{percent}% of Account Balance"
            values={{
              percent: percentOfBalance > 100 ? ">100" : percentOfBalance
            }}
          />
        </div>
      </div>

      <div className={styles.destinationContainer}>
        <div className={classNames(styles.sendInputWrapper, styles.address)}>
          {isSendSelf ? (
            // `selectWithBigFont` className is
            // temp solution to skinning from ReactSelectGlobal.css.
            // When react-select will be replaced by the `pi-ui` component,
            // this className can be deleted.
            <>
              <label
                htmlFor={`addressInput-${index}`}
                className={styles.addressInputLabel}>
                <T id="sendtab.sendTo" m="Send to" />
              </label>
              <ReceiveAccountsSelect
                id={`addressInput-${index}`}
                className="selectWithBigFont"
                selectClassName={styles.receiveAccountSelect}
                disabled={receiveAccountsSelectDisabled}
                getAddressForSelected={true}
                showAccountsButton={false}
                onKeyDown={onKeyDown}
                account={receiveAccount}
              />
            </>
          ) : (
            <AddressInput
              newBiggerFontStyle
              id={`addressInput-${index}`}
              required={true}
              label={intl.formatMessage(messages.addressLabel)}
              autoFocus={index === 0}
              showErrors={error && error.address}
              invalid={error && error.address}
              invalidMessage={error && error.address}
              value={destination}
              placeholder={intl.formatMessage(
                messages.destinationAddrPlaceholder
              )}
              inputClassNames={classNames(
                styles.addressInput,
                error && error.address && styles.error
              )}
              onChange={(e) =>
                onValidateAddress({ address: e.target.value, index })
              }
              onKeyDown={onKeyDown}>
              {!destination ? (
                <Button
                  kind="secondary"
                  size="sm"
                  className={styles.pasteButton}
                  onClick={(e) => {
                    e.preventDefault();
                    onValidateAddress({
                      address: wallet.readFromClipboard(),
                      index
                    });
                  }}>
                  Paste
                </Button>
              ) : (
                <Button
                  aria-label="Clear Address"
                  kind="secondary"
                  className={styles.clearAddressButton}
                  onClick={(e) => {
                    e.preventDefault();
                    onValidateAddress({ address: "", index });
                  }}>
                  <div />
                </Button>
              )}
            </AddressInput>
          )}
        </div>
        {getAddInputIcon({
          isSendSelf,
          onAddOutput,
          onRemoveOutput,
          index,
          isSendAll,
          onlySendSelfAllowed
        })}
      </div>
    </div>
  );
};

export default injectIntl(SendOutputRow);
