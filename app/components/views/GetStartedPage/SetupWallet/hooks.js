import { useCallback, createElement as h, useState } from "react";
import { useService } from "@xstate/react";
import { IMMATURE, LIVE, UNMINED } from "constants/decrediton";
import { FormattedMessage as T } from "react-intl";
import SettingMixedAccount from "./SetMixedAcctPage/SetMixedAcctPage";
import ProcessUnmanagedTickets from "./ProcessUnmanagedTickets/ProcessUnmanagedTickets";
import ProcessManagedTickets from "./ProcessManagedTickets/ProcessManagedTickets";
import SettingAccountsPassphrase from "./SetAccountsPassphrase";
import { useDaemonStartup, useAccounts, usePrevious } from "hooks";
import { useDispatch } from "react-redux";
import {
  checkAllAccountsEncrypted,
  setAccountsPass
} from "actions/ControlActions";
import { ExternalLink } from "shared";

export const useWalletSetup = (settingUpWalletRef) => {
  const dispatch = useDispatch();

  const [current, send] = useService(settingUpWalletRef);
  const [StateComponent, setStateComponent] = useState(null);
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

  const previousState = usePrevious(current);

  const onCheckAcctsPass = useCallback(() => {
    return dispatch(checkAllAccountsEncrypted());
  }, [dispatch]);

  const onProcessAccounts = useCallback(
    (passphrase) => {
      return dispatch(setAccountsPass(passphrase));
    },
    [dispatch]
  );

  const sendContinue = useCallback(() => {
    send({ type: "CONTINUE" });
  }, [send]);

  const onSendError = useCallback(
    (error) => {
      send({ type: "ERROR", error });
    },
    [send]
  );

  const onSendBack = useCallback(() => {
    send({ type: "BACK" });
  }, [send]);

  const getStateComponent = useCallback(async () => {
    const { error, isWatchingOnly, isTrezor } = current.context;

    let component, hasLive, hasSoloTickets;
    if (previousState && current.value === previousState.value) return;

    switch (current.value) {
      case "settingAccountsPass": {
        // step not needed with trezor or watching only wallets.
        if (isWatchingOnly || isTrezor) {
          sendContinue();
          return;
        }
        const allEncrypted = onCheckAcctsPass();
        if (allEncrypted) {
          sendContinue();
        } else {
          component = h(SettingAccountsPassphrase, {
            error,
            onSendContinue: sendContinue,
            onSendError,
            send,
            title: (
              <T
                id="getstarted.setAccountsPass.title"
                m="Migrate to per-account passphrases"
              />
            ),
            onProcessAccounts,
            description: (
              <T
                id="getstarted.setAccountsPass.description"
                m={`Decrediton now uses per-account locking, which requires a one time migration.
                  Enter your current passphrase to perform this upgrade.
                  Visit {link} to know more.`}
                values={{
                  link: (
                    <ExternalLink
                      href={
                        "https://docs.decred.org/wallets/decrediton/migrations"
                      }>
                      <T id="getstarted.setAccountsPass.docs" m="Decred docs" />
                    </ExternalLink>
                  )
                }}
              />
            )
          });
        }
        break;
      }
      case "settingMixedAccount": {
        const outputsByAcctMap = await getCoinjoinOutputspByAcct();
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
      }
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
    sendContinue,
    isProcessingManaged,
    isProcessingUnmanaged,
    onProcessUnmanagedTickets,
    onSendBack,
    onSendError,
    previousState,
    current,
    onCheckAcctsPass,
    onProcessAccounts
  ]);

  return {
    getStateComponent,
    StateComponent
  };
};
