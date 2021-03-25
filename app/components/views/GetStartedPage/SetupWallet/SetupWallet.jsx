import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { createElement as h } from "react";
import { useState, useEffect, useCallback } from "react";
import { useService } from "@xstate/react";
import SetupWalletPage from "./SetupWalletPage";
import SettingMixedAccount from "./SetMixedAcctPage/SetMixedAcctPage";
import ProcessUnmanagedTickets from "./ProcessUnmanagedTickets/ProcessUnmanagedTickets";
import ProcessManagedTickets from "./ProcessManagedTickets/ProcessManagedTickets";
import { useDaemonStartup, useAccounts, usePrevious } from "hooks";
import { IMMATURE, LIVE, UNMINED } from "constants/Decrediton";
import { FormattedMessage as T } from "react-intl";

const SetupWallet = ({ settingUpWalletRef }) => {
  const {
    getCoinjoinOutputspByAcct,
    stakeTransactions,
    onProcessManagedTickets,
    goToHome,
    onProcessUnmanagedTickets,
    isProcessingUnmanaged,
    isProcessingManaged
  } = useDaemonStartup();
  const { mixedAccount } = useAccounts();
  const [current, send] = useService(settingUpWalletRef);
  const [StateComponent, setStateComponent] = useState(null);

  const previousState = usePrevious(current);

  const sendContinue = useCallback(() => {
    send({ type: "CONTINUE" });
  }, [send]);

  const onSendError = useCallback((error) => {
    send({ type: "ERROR", error });
  }, [send]);

  const onSendBack = useCallback(() => {
    send({ type: "BACK" });
  }, [send]);

  const getStateComponent = useCallback(() => {
    const { error } = current.context;

    let component, hasLive, hasSoloTickets;
    if (previousState && current.value === previousState.value) return;

    switch (current.value) {
      case "settingMixedAccount":
        getCoinjoinOutputspByAcct()
          .then((outputsByAcctMap) => {
            const hasMixedOutputs =
              outputsByAcctMap &&
              outputsByAcctMap.reduce(
                (foundMixed, { coinjoinSum }) => coinjoinSum > 0 || foundMixed,
                false
              );
            if (!hasMixedOutputs || mixedAccount) {
              sendContinue();
            } else {
              component = h(SettingMixedAccount, {
                cancel: sendContinue,
                sendContinue
              });
            }
          })
          .catch((err) => console.log(err));
        break;
      case "processingManagedTickets":
        hasLive = Object.keys(stakeTransactions).some((hash) => {
          const tx = stakeTransactions[hash];
          // check if the wallet has at least one vsp live ticket.
          if (
            tx.status === IMMATURE ||
            tx.status === LIVE ||
            tx.status === UNMINED
          ) {
            // On old vsp the fee is an input. So if the tx has more than one
            // input, it means it is an old vsp ticket and have no feeStatus.
            // So we can skip it.
            if (tx.txInputs.length !== 1) {
              return false;
            }
            return true;
          }
        });
        // if no live tickets, we can skip it.
        if (!hasLive) {
          sendContinue();
        } else {
          component = h(ProcessManagedTickets, {
            error,
            onSendContinue: sendContinue,
            onSendError,
            send,
            cancel: onSendBack,
            onProcessTickets: onProcessManagedTickets,
            title: (
              <T
                id="getstarted.processManagedTickets.title"
                m="Process Managed Tickets"
              />
            ),
            isProcessingManaged: isProcessingManaged,
            noVspSelection: true,
            description: (
              <T
                id="getstarted.processManagedTickets.description"
                m={`Your wallet appears to have live tickets. Processing managed
              tickets confirms with the VSPs that all of your submitted tickets
              are currently known and paid for by the VSPs. If you've already 
              confirmed your tickets then you may skip this step.`}
              />
            )
          });
        }
        break;
      case "processingUnmanagedTickets":
        hasSoloTickets = false;
        Object.keys(stakeTransactions).forEach((hash) => {
          const tx = stakeTransactions[hash];
          // check if it is a spendable ticket.
          if (
            tx.status === IMMATURE ||
            tx.status === LIVE ||
            tx.status === UNMINED
          ) {
            // On old vsp the fee is an input. So if the tx has more than one
            // input, it means it is an old vsp ticket and have no feeStatus.
            // So we can skip it.
            if (tx.txInputs.length !== 1) {
              return;
            }
            // feeStatus can be 0.
            if (!tx.feeStatus && tx.feeStatus !== 0) {
              hasSoloTickets = true;
            }
          }
        });
        if (!hasSoloTickets) {
          sendContinue();
        } else {
          component = h(ProcessUnmanagedTickets, {
            error,
            send,
            onSendContinue: sendContinue,
            onSendError,
            onProcessTickets: onProcessUnmanagedTickets,
            isProcessingUnmanaged: isProcessingUnmanaged,
            cancel: onSendBack,
            title: (
              <T
                id="getstarted.processUnmangedTickets.title"
                m="Process Unmanaged Tickets"
              />
            ),
            description: (
              <T
                id="getstarted.processUnmangedTickets.description"
                m={`Looks like you have vsp ticket with unprocessed fee. If they are picked
                to vote and they are not linked with a vsp, they may miss, if you are not
                properly dealing with solo vote.`}
              />
            )
          });
        }
        break;
      case "goToHomeView":
        goToHome();
        break;
    }

    return setStateComponent(component);
  }, [
    getCoinjoinOutputspByAcct,
    goToHome,
    mixedAccount,
    onProcessManagedTickets,
    send,
    stakeTransactions,
    current.context,
    current.value,
    sendContinue,
    isProcessingManaged,
    isProcessingUnmanaged,
    onProcessUnmanagedTickets,
    onSendBack,
    onSendError,
    previousState
  ]);

  useEffect(() => {
    getStateComponent();
  }, [current, getStateComponent]);

  return <SetupWalletPage {...{ StateComponent }} />;
};

export default injectIntl(withRouter(SetupWallet));
