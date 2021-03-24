import { injectIntl } from "react-intl";
import { withRouter } from "react-router";
import { createElement as h } from "react";
import { DecredLoading } from "indicators";
import { useState, useEffect, useCallback } from "react";
import { useService } from "@xstate/react";
import { sendParent } from "xstate";
import SetupWalletPage from "./SetupWalletPage";
import SettingMixedAccount from "./SetMixedAcctPage/SetMixedAcctPage";
import ProcessUnmanagedTickets from "./ProcessUnmanagedTickets/ProcessUnmanagedTickets";
import ProcessManagedTickets from "./ProcessManagedTickets/ProcessManagedTickets";
import { useDaemonStartup, useAccounts } from "hooks";
import { IMMATURE, LIVE, UNMINED } from "constants/Decrediton";

const SetupWallet = ({ settingUpWalletRef, isTestNet }) => {
  // const {
  //   decodeSeed,
  //   cancelCreateWallet,
  //   generateSeed,
  //   createWatchOnlyWalletRequest,
  //   createWalletRequest,
  //   isTestNet
  // } = useCreateWallet();
  const {
    getCoinjoinOutputspByAcct,
    stakeTransactions,
    goToHome  
  } = useDaemonStartup();
  const { mixedAccount } = useAccounts();
  const [current, send] = useService(settingUpWalletRef);
  const [StateComponent, setStateComponent] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const sendEvent = useCallback(
    (data) => {
      const { type, payload } = data;
      send({ type, payload });
    },
    [send]
  );

  const sendContinue = useCallback(() => {
    send({ type: "CONTINUE" });
  }, [send]);

  const previousStep = useCallback(() => {
    send({ type: "BACK", isTestNet });
  }, [send, isTestNet]);

  const getStateComponent = useCallback(async () => {
    const { error } = current.context;
    let component;

    switch (current.value) {
      case "settingMixedAccount":
        getCoinjoinOutputspByAcct()
          .then((outputsByAcctMap) => {
            console.log(outputsByAcctMap)
            const hasMixedOutputs =
              outputsByAcctMap &&
              outputsByAcctMap.reduce(
                (foundMixed, { coinjoinSum }) => coinjoinSum > 0 || foundMixed,
                false
              );
            if (!hasMixedOutputs || mixedAccount) {
              sendContinue();
            } else {
              PageComponent = h(SettingMixedAccount, {
                cancel: sendContinue,
                sendContinue
              });
              setPageComponent(PageComponent);
            }
          })
          .catch((err) => console.log(err));
        component = h(SettingMixedAccount, {
          // sendBack: cancelWalletCreation,
          sendContinue
        });
        break;
      // XXX: move this to create wallet machine??
      // is this needed?
      // state for recoverying tickets if creating new wallet.
      case "syncVSPTickets":
        const { isCreateNewWallet, passPhrase, selectedWallet } = current.context;
        console.log(isCreateNewWallet)
        console.log(passPhrase)
        console.log(selectedWallet)
        // isCreateNewWallet needs to be false for indicating a wallet
        // restore. Can be other cases if it is null or undefined.
        let { isWatchingOnly, isTrezor } = selectedWallet;
        const val = selectedWallet.value;
        if (val) {
          if (!isWatchingOnly) isWatchingOnly = val.isWatchingOnly;
          if (!isTrezor) isTrezor = val.isTrezor;
        }
        // Watching only wallets can not sync tickets as they need signing.
        if (isWatchingOnly || isTrezor) {
          send({ type: "FINISH" });
          return;
        }
        if (isCreateNewWallet === false) {
          await onProcessManagedTickets(passPhrase).catch((error) => {
            console.log("onProcessManagedTickets failed:", error);
          });
        }

        sendContinue();        
        break;
      case "processingManagedTickets":
        const hasLive = Object.keys(stakeTransactions).some((hash) => {
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
        }
        break;
      case "processingUnmanagedTickets":
        let hasSoloTickets = false;
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
        }
        break;
      case "goToHomeView":
        goToHome();
        break;
    }

    console.log(component)
    return setStateComponent(component);
  }, [
    previousStep,
    current.context,
    current.value,
    sendContinue
  ]);

  useEffect(() => {
    getStateComponent()
  }, [current])
  // useEffect(() => {
  //   const { isNew, walletMasterPubKey, mnemonic } = current.context;
  //   switch (current.value) {
  //     case "createWalletInit":
  //       setIsNew(isNew);
  //       setWalletMasterPubkey(walletMasterPubKey);
  //       send({ type: "CREATE_WALLET", isNew });
  //       send({
  //         type: "RESTORE_WATCHING_ONLY_WALLET",
  //         isWatchingOnly: !!walletMasterPubKey
  //       });
  //       send({
  //         type: "RESTORE_WALLET",
  //         isRestore: !isNew,
  //         isWatchingOnly: !!walletMasterPubKey
  //       });
  //       break;
  //     case "generateNewSeed":
  //       // We only generate the seed once. If mnemonic already exists, we return it.
  //       if (mnemonic) return;
  //       sendContinue();
  //       generateSeed().then((response) => {
  //         // Allows verification skip in dev
  //         const seed = isTestNet ? response.getSeedBytes() : null;
  //         const mnemonic = response.getSeedMnemonic();
  //         sendEvent({ type: "SEED_GENERATED", payload: { mnemonic, seed } });
  //       });
  //       break;
  //     case "writeSeed":
  //       checkIsValid();
  //       break;
  //     case "confirmSeed":
  //       checkIsValid();
  //       break;
  //     case "restoreWatchingOnly":
  //       onCreateWatchOnly();
  //       break;
  //     case "finished":
  //       break;
  //     case "walletCreated":
  //       break;
  //   }
  //   getStateComponent();
  // }, [
  //   current,
  //   isValid,
  //   checkIsValid,
  //   generateSeed,
  //   getStateComponent,
  //   isTestNet,
  //   onCreateWatchOnly,
  //   send,
  //   sendContinue,
  //   sendEvent
  // ]);

  return <SetupWalletPage {...{ StateComponent }} />;
};

export default injectIntl(withRouter(SetupWallet));
