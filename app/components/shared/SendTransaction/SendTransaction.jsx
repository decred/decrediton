import { FormattedMessage as T } from "react-intl";
import { useSendTransaction, useOutputs } from "./hooks";
import { useState, useEffect, useCallback } from "react";
import { useMountEffect } from "hooks";
import { spring, presets } from "react-motion";
import { baseOutput } from "./helpers";
import { usePrevious } from "hooks";
import Form from "./Form";

const SendTransaction = ({
  onlySendSelfAllowed,
  receiveAccountsSelectDisabled,
  styles,
  hideDetails,
  sendButtonLabel,
  receiveAccount,
  spendingAccount,
  filterFromAccounts,
  SendOutputRow
}) => {
  const {
    defaultSpendingAccount,
    unsignedTransaction,
    unsignedRawTx,
    nextAddress,
    nextAddressAccount,
    estimatedFee,
    estimatedSignedSize,
    constructTxLowBalance,
    publishTxResponse,
    totalSpent,
    notMixedAccounts,
    isTrezor,
    isWatchingOnly,
    isConstructingTransaction,
    attemptConstructTransaction,
    validateAddress,
    onClearTransaction,
    onGetNextAddressAttempt,
    getRunningIndicator,
    constructTxRequestAttempt
  } = useSendTransaction();

  const {
    outputs,
    onAddOutput,
    onUpdateOutput,
    onRemoveOutput,
    onSetOutputs,
    prevOutputs
  } = useOutputs();

  const [account, setAccount] = useState(
    spendingAccount ? spendingAccount : defaultSpendingAccount
  );
  const [sendAllAmount, setSendAllAmount] = useState(totalSpent);
  const [isSendSelf, setIsSendSelf] = useState(onlySendSelfAllowed);
  const [isSendAll, setIsSendAll] = useState(false);
  const [insuficientFunds, setInsuficientFunds] = useState(false);
  const [showPassphraseModal, setShowPassphraseModal] = useState(false);

  const prevPublishTxResponse = usePrevious(publishTxResponse);
  const prevNextAddress = usePrevious(nextAddress);
  const prevIsSendSelf = usePrevious(isSendSelf);
  const prevAccount = usePrevious(account);

  const onValidateAddress = async ({ address, index }) => {
    let error;
    const ref = { ...outputs[index] };
    ref.data.destination = address;
    if (!address) {
      error = (
        <T id="send.errors.invalidAddress" m="Please enter a valid address" />
      );
    }
    try {
      const validated = await validateAddress(address);
      if (!validated.getIsValid()) {
        error = (
          <T id="send.errors.invalidAddress" m="Please enter a valid address" />
        );
      }
      ref.data.error.address = error;
      onUpdateOutput(ref);
    } catch (err) {
      return err;
    }
  };

  const onValidateAmount = ({ atomValue, index }) => {
    let error;
    if (!atomValue || isNaN(atomValue)) {
      error = (
        <T id="send.errors.invalidAmount" m="Please enter a valid amount" />
      );
    }
    if (atomValue <= 0) {
      error = (
        <T
          id="send.errors.negativeAmount"
          m="Please enter a valid amount (> 0)"
        />
      );
    }
    const ref = { ...outputs[index] };
    ref.data.amount = atomValue;
    ref.data.error.amount = error;
    onUpdateOutput(ref);
  };

  const onChangeAccount = (account) => {
    setAccount(account);

    if (isSendAll) {
      const newOutputs = [
        {
          ...outputs[0],
          data: {
            ...outputs[0].data,
            amount: account.spendable
          }
        }
      ];
      onSetOutputs(newOutputs);
    }
  };

  const onShowSendSelf = () => {
    const newOutputs = [{ ...outputs[0], data: baseOutput().data }];
    setIsSendSelf(true);
    onSetOutputs(newOutputs);
  };

  const onShowSendOthers = () => {
    const newOutputs = [{ ...outputs[0], data: baseOutput().data }];
    setIsSendSelf(false);
    onSetOutputs(newOutputs);
  };

  const onShowSendAll = () => {
    const newOutputs = [
      {
        ...outputs[0],
        data: {
          ...outputs[0].data,
          amount: account.spendable,
          error: {
            ...outputs[0].data.error,
            amount: null
          }
        }
      }
    ];
    setIsSendAll(true);
    onSetOutputs(newOutputs);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && isValid()) {
      setShowPassphraseModal(true);
    }
  };

  const onHideSendAll = () => {
    const newOutputs = [
      {
        ...outputs[0],
        data: {
          ...outputs[0].data,
          amount: null
        }
      }
    ];
    setIsSendAll(false);
    onSetOutputs(newOutputs);
  };

  const hasError = useCallback(() => {
    const outputHasError = (o) =>
      !o.data.amount ||
      o.data.destination.length === 0 ||
      o.data.error.amount ||
      o.data.error.address;
    return outputs.some(outputHasError);
  }, [outputs]);

  const isValid = () =>
    !!(
      !hasError() &&
      unsignedTransaction &&
      !isConstructingTransaction &&
      !constructTxLowBalance
    );

  const willEnter = () => ({
    opacity: 0
  });

  const willLeave = () => ({
    opacity: spring(0, { stiffness: 210, damping: 20 })
  });

  const resetShowPassphraseModal = () => setShowPassphraseModal(false);

  const getOutputRows = () => {
    // if sending to another accounts from same wallet, there is no need to
    // filter accounts.
    const filterAccounts = filterFromAccounts
      ? filterFromAccounts
      : isSendSelf
      ? []
      : notMixedAccounts;
    const accountsType = filterAccounts ? "visible" : "spending";
    return outputs.map((output, index) => ({
      data: (
        <SendOutputRow
          {...{
            index,
            outputs,
            account,
            ...output.data,
            isSendAll,
            isSendSelf,
            totalSpent,
            sendAllAmount,
            onValidateAddress,
            onValidateAmount,
            onShowSendAll,
            onHideSendAll,
            onRemoveOutput,
            onChangeAccount,
            onShowSendSelf,
            onShowSendOthers,
            onAddOutput,
            onKeyDown,
            filterAccounts,
            accountsType,
            onlySendSelfAllowed,
            receiveAccountsSelectDisabled,
            receiveAccount
          }}
        />
      ),
      key: "output_" + index,
      style: {
        opacity: spring(1, presets.gentle)
      }
    }));
  };

  const onAttemptConstructTransaction = useCallback(() => {
    const confirmations = 0;
    setSendAllAmount(account.spendable);
    if (hasError()) return;
    if (!isSendAll) {
      return attemptConstructTransaction(
        account.value,
        confirmations,
        outputs.map(({ data }) => ({
          amount: data.amount,
          destination: data.destination
        }))
      );
    } else {
      return attemptConstructTransaction(
        account.value,
        confirmations,
        outputs,
        true
      );
    }
  }, [
    setSendAllAmount,
    hasError,
    isSendAll,
    attemptConstructTransaction,
    account.spendable,
    account.value,
    outputs
  ]);

  // Executes on component updates
  useEffect(() => {
    let newOutputs;
    if (publishTxResponse && publishTxResponse !== prevPublishTxResponse) {
      if (isSendSelf) {
        onGetNextAddressAttempt(nextAddressAccount.value);
      }
      setIsSendAll(false);
      newOutputs = [baseOutput()];
    }
    if (
      isSendSelf &&
      (prevNextAddress != nextAddress ||
        (prevIsSendSelf != isSendSelf && nextAddress))
    ) {
      newOutputs = (newOutputs || outputs).map((o) => ({
        ...o,
        data: { ...o.data, destination: nextAddress }
      }));
    }
    if (newOutputs) {
      onSetOutputs(newOutputs);
    }

    if (constructTxLowBalance) {
      setInsuficientFunds(true);
    } else {
      setInsuficientFunds(false);
    }

    if (prevOutputs != outputs || prevAccount != account) {
      onAttemptConstructTransaction();
    }
  }, [
    publishTxResponse,
    prevPublishTxResponse,
    isSendSelf,
    prevNextAddress,
    nextAddress,
    prevIsSendSelf,
    constructTxLowBalance,
    nextAddressAccount.value,
    outputs,
    prevOutputs,
    onSetOutputs,
    onAttemptConstructTransaction,
    onGetNextAddressAttempt,
    account,
    prevAccount,
    constructTxRequestAttempt
  ]);

  // Clear transaction info on unmount
  useMountEffect(() => {
    return () => onClearTransaction();
  });

  return (
    <Form
      {...{
        account,
        isSendSelf,
        outputs,
        totalSpent,
        estimatedFee,
        estimatedSignedSize,
        isValid,
        getOutputRows,
        nextAddressAccount,
        showPassphraseModal,
        resetShowPassphraseModal,
        unsignedRawTx,
        willLeave,
        willEnter,
        isWatchingOnly,
        isTrezor,
        insuficientFunds,
        styles,
        hideDetails,
        sendButtonLabel,
        getRunningIndicator
      }}
    />
  );
};

export default SendTransaction;
