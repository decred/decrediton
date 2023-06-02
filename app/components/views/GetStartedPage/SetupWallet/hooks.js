import { useCallback, createElement as h, useState } from "react";
import { useService } from "@xstate/react";
import { IMMATURE, LIVE, UNMINED } from "constants/decrediton";
import { FormattedMessage as T } from "react-intl";
import SettingMixedAccount from "./SetMixedAcctPage/SetMixedAcctPage";
import ProcessUnmanagedTickets from "./ProcessUnmanagedTickets";
import ProcessManagedTickets from "./ProcessManagedTickets";
import SettingAccountsPassphrase from "./SetAccountsPassphrase";
import ResendVotesToRecentlyUpdatedVSPs from "./ResendVotesToRecentlyUpdatedVSPs";
import { useDaemonStartup, useAccounts, usePrevious } from "hooks";
import { useDispatch } from "react-redux";
import {
  checkAllAccountsEncrypted,
  setAccountsPass
} from "actions/ControlActions";
import {
  setCanDisableProcessManaged,
  getRecentlyUpdatedUsedVSPs,
  getNotAbstainVotes
} from "actions/VSPActions";
import { ExternalLink } from "shared";

export const useWalletSetup = (settingUpWalletRef) => {
  const dispatch = useDispatch();

  const [current, send] = useService(settingUpWalletRef);
  const [StateComponent, setStateComponent] = useState(null);
  const {
    getCoinjoinOutputspByAcct,
    stakeTransactions,
    goToHome,
    isProcessingManaged,
    needsProcessManagedTickets
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

  const onGetRecentlyUpdatedUsedVSPs = useCallback(
    () => dispatch(getRecentlyUpdatedUsedVSPs()),
    [dispatch]
  );

  const onGetNotAbstainVotes = useCallback(
    () => dispatch(getNotAbstainVotes()),
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

  const onSkipProcessManaged = useCallback(() => {
    dispatch(setCanDisableProcessManaged(false));
    send({ type: "BACK" });
  }, [send, dispatch]);

  const getStateComponent = useCallback(async () => {
    const ctx = current.context;
    const {
      selectedWallet,
      error,
      passPhrase,
      isCreateNewWallet,
      isRestoreNewWallet
    } = ctx;
    const { isWatchingOnly, isTrezor, isLedger } = selectedWallet.value;

    let component, hasSoloTickets;

    // Check if we have live, vspd-based tickets.
    const hasLiveVSPdTickets = Object.keys(stakeTransactions).some((hash) => {
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

    if (previousState && current.value === previousState.value) return;

    switch (current.value) {
      case "settingAccountsPass": {
        // step not needed with trezor or watching only wallets.
        if (isWatchingOnly || isTrezor || isLedger) {
          sendContinue();
          return;
        }
        const allEncrypted = onCheckAcctsPass();
        if (allEncrypted) {
          sendContinue();
        } else {
          const onSubmitAccountsPassphrase = (passphrase) => {
            // send a continue so we can go to the loading state
            onProcessAccounts(passphrase)
              .then(() => sendContinue())
              .catch((err) => onSendError(err));
          };

          if (
            passPhrase &&
            passPhrase != "" &&
            (isCreateNewWallet || isRestoreNewWallet) &&
            !isProcessingManaged
          ) {
            return onSubmitAccountsPassphrase(passPhrase);
          }

          component = h(SettingAccountsPassphrase, {
            onSubmitAccountsPassphrase,
            isProcessingManaged,
            error,
            title: (
              <T
                id="getstarted.setAccountsPass.title"
                m="Migrate to per-account passphrases"
              />
            ),
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
      case "settingMixedAccount":
        {
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
              onSendContinue: sendContinue
            });
          }
        }
        break;
      case "processingManagedTickets":
        // if no live tickets, we can skip it.
        if (!hasLiveVSPdTickets || !needsProcessManagedTickets) {
          sendContinue();
        } else {
          component = h(ProcessManagedTickets, {
            error,
            send,
            cancel: onSkipProcessManaged
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
            cancel: onSendBack
          });
        }
        break;
      case "resendVotesToRecentlyUpdatedVSPs":
        {
          const notAbstainVotes = onGetNotAbstainVotes();

          if (notAbstainVotes.length === 0) {
            sendContinue();
          } else {
            const vsps = await onGetRecentlyUpdatedUsedVSPs();
            if (vsps.length === 0) {
              sendContinue();
            } else {
              component = h(ResendVotesToRecentlyUpdatedVSPs, {
                cancel: onSendBack,
                send,
                vsps,
                votes: notAbstainVotes
              });
            }
          }
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
    send,
    stakeTransactions,
    sendContinue,
    isProcessingManaged,
    needsProcessManagedTickets,
    onSendBack,
    onSendError,
    previousState,
    current,
    onCheckAcctsPass,
    onProcessAccounts,
    onSkipProcessManaged,
    onGetRecentlyUpdatedUsedVSPs,
    onGetNotAbstainVotes
  ]);

  return {
    getStateComponent,
    StateComponent
  };
};
