import { useState, useEffect, useCallback } from "react";
import SendPage from "./SendPage/SendPage";
import SendOutputRow from "./SendOutputRow/SendOutputRow";
import ErrorScreen from "ErrorScreen";
import { FormattedMessage as T } from "react-intl";
import { spring, presets } from "react-motion";
import { DescriptionHeader } from "layout";
import { baseOutput } from "./helpers";
import { useService, usePrevious } from "hooks";
import { useSendTab, useOutputs } from "./hooks";

export const SendTabHeader = () => {
  const { isTestNet } = useService();
  return (
    <DescriptionHeader
      description={
        isTestNet ? (
          <T
            id="transactions.description.send.testnet"
            m={
              "Testnet Decred addresses always begin with letter T and contain 26-35 alphanumeric characters\n(e.g. TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0)."
            }
          />
        ) : (
          <T
            id="transactions.description.send.mainnet"
            m={
              "Mainnet Decred addresses always begin with letter D and contain 26-35 alphanumeric characters\n(e.g. DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X)."
            }
          />
        )
      }
    />
  );
};

const SendTab = () => {
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
    onGetNextAddressAttempt
  } = useSendTab();

  const {
    outputs,
    onAddOutput,
    onUpdateOutput,
    onRemoveOutput,
    onSetOutputs
  } = useOutputs();

  const { walletService } = useService();

  const [account, setAccount] = useState(defaultSpendingAccount);
  const [sendAllAmount, setSendAllAmount] = useState(totalSpent);
  const [isSendSelf, setIsSendSelf] = useState(false);
  const [isSendAll, setIsSendAll] = useState(false);
  const [insuficientFunds, setInsuficientFunds] = useState(false);
  const [showPassphraseModal, setShowPassphraseModal] = useState(false);

  const prevPublishTxResponse = usePrevious(publishTxResponse);
  const prevNextAddress = usePrevious(nextAddress);
  const prevIsSendSelf = usePrevious(isSendSelf);

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
      onAttemptConstructTransaction();
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
    onAttemptConstructTransaction();
  };

  const onChangeAccount = (account) => {
    setAccount(account);
    onAttemptConstructTransaction();
  };

  const onShowSendSelf = () => {
    const newOutputs = [{ ...outputs[0], data: baseOutput().data }];
    setIsSendSelf(true);
    onSetOutputs(newOutputs);
    onAttemptConstructTransaction();
  };

  const onShowSendOthers = () => {
    const newOutputs = [{ ...outputs[0], data: baseOutput().data }];
    setIsSendSelf(false);
    onSetOutputs(newOutputs);
    onAttemptConstructTransaction();
  };

  const onShowSendAll = () => {
    const newOutputs = [{
      ...outputs[0],
      data: {
        ...outputs[0].data,
        amount: account.spendable
      }
    }];
    setIsSendAll(true);
    onSetOutputs(newOutputs);
    onAttemptConstructTransaction();
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && isValid()) {
      setShowPassphraseModal(true);
    }
  };

  const onHideSendAll = () => {
    const newOutputs = [{
      ...outputs[0],
      data: {
        ...outputs[0].data,
        amount: null
      }
    }];
    setIsSendAll(false);
    onSetOutputs(newOutputs);
    onAttemptConstructTransaction();
  };

  const hasError = useCallback(() => {
    const outputHasError = (o) =>
        !o.data.amount ||
        o.data.destination.length === 0 ||
        o.data.error.amount ||
        o.data.error.address;
    return outputs.some(outputHasError);
  }, [outputs]);

  const isValid = () => !!(
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

  const resetShowPassphraseModal = () =>
    setShowPassphraseModal(false);

  const getOutputRows = () => {
    // if sending to another accounts from same wallet, there is no need to
    // filter accounts.
    const filterAccounts = isSendSelf ? [] : notMixedAccounts;
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
            accountsType
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
    if (publishTxResponse && publishTxResponse != prevPublishTxResponse) {
      if (isSendSelf) {
        onGetNextAddressAttempt(nextAddressAccount.value);
      }
      setIsSendAll(false);
      onSetOutputs([baseOutput()]);
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
      onAttemptConstructTransaction();
    }
    if (constructTxLowBalance) {
      setInsuficientFunds(true);
    } else {
      setInsuficientFunds(false);
    }

    return () => onClearTransaction();
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
    onSetOutputs,
    onAttemptConstructTransaction,
    onClearTransaction,
    onGetNextAddressAttempt
  ]);

  return !walletService ? <ErrorScreen /> : (
    <SendPage
      {...{
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
        insuficientFunds
      }}
    />
  );
};

export default SendTab;
