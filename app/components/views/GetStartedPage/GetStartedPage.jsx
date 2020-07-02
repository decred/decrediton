import { useEffect, useState, useCallback, useMemo } from "react";
import { daemonStartup } from "connectors";
import { useMachine } from "@xstate/react";
import { getStartedMachine } from "stateMachines/GetStartedStateMachine";
import GetStartedWrapper from "./GetStarted";
import { AdvancedStartupBody } from "./AdvancedStartup/AdvancedStartup";
import { injectIntl } from "react-intl";
import WalletSelection from "./WalletSelection/WalletSelection";
import CreateWalletMachine from "./CreateWalletPage/CreateWalletPage";
import Settings from "./Settings/Settings";
import Logs from "./Logs/Logs";
import { FormattedMessage as T } from "react-intl";
import { createElement as h } from "react";
import GetStartedMachinePage from "./GetStartedMachinePage";
import TrezorConfig from "./TrezorConfig/TrezorConfig";
import PreCreateWalletForm from "./PreCreateWallet/PreCreateWallet";
import RescanWalletBody from "./RescanWallet/RescanWallet";
import WalletPubpassInput from "./OpenWallet/OpenWallet";
import ReleaseNotes from "./ReleaseNotes/ReleaseNotes";
import { ipcRenderer } from "electron";

// XXX: these animations classes are passed down to AnimatedLinearProgressFull
// and styling defined in Loading.less and need to handled when loading.less
// is migrated, and classes should be defined then in ./GetStarted.module.css

// css animation classes
const blockChainLoading = "blockchain-syncing";
const daemonWaiting = "daemon-waiting";
const discoveringAddresses = "discovering-addresses";
const scanningBlocks = "scanning-blocks";
const finalizingSetup = "finalizing-setup";
const fetchingHeaders = "fetching-headers";
const establishingRpc = "establishing-rpc";

const GetStarted = ({
  onConnectDaemon,
  checkNetworkMatch,
  syncDaemon,
  onStartWallet,
  onRetryStartRPC,
  onGetAvailableWallets,
  onStartDaemon,
  setSelectedWallet,
  goToErrorPage,
  goToSettings,
  backToCredentials,
  startSPVSync,
  isSPV,
  isAdvancedDaemon,
  getDaemonSynced,
  getSelectedWallet,
  syncFetchMissingCfiltersAttempt,
  syncFetchHeadersAttempt,
  syncRescanAttempt,
  syncDiscoverAddressesAttempt,
  synced,
  updateAvailable,
  isTestNet
}) => {
  const [PageComponent, setPageComponent] = useState(null);
  const machine = getStartedMachine({
    onConnectDaemon,
    checkNetworkMatch,
    syncDaemon,
    onStartWallet,
    onRetryStartRPC,
    onGetAvailableWallets,
    onStartDaemon,
    setSelectedWallet,
    goToErrorPage,
    goToSettings,
    backToCredentials,
    startSPVSync
  });
  const [state, send] = useMachine(machine);
  const getError = useCallback((serviceError) => {
    if (!serviceError) return;
    // We can return errors in the form of react component, which are objects.
    // So we handle them first.
    if (React.isValidElement(serviceError)) {
      return serviceError;
    }
    // If the errors is an object but not a react component, we strigfy it so we can
    // render.
    if (typeof serviceError === "object") {
      return JSON.stringify(serviceError);
    }
    return serviceError;
  }, []);
  const error = useMemo(
    () => state && state.context && getError(state.context.error),
    [state, getError]
  );

  // preStartDaemon gets data from cli to connect with remote dcrd if rpc
  // connection data is inputed and sends the first interaction with the state
  // machine, so it can start. Only one of the choises is chosen.
  const preStartDaemon = useCallback(() => {
    const cliOptions = ipcRenderer.sendSync("get-cli-options");
    let rpcCliRemote;
    if (cliOptions.rpcPresent) {
      rpcCliRemote = {
        rpc_user: cliOptions.rpcUser,
        rpc_pass: cliOptions.rpcPass,
        rpc_cert: cliOptions.rpcCert,
        rpc_host: cliOptions.rpcHost,
        rpc_port: cliOptions.rpcPort
      };
      send({
        type: "START_CLI_REMOTE_DAEMON",
        remoteCredentials: rpcCliRemote
      });
    }
    // If daemon is synced or isSPV mode we check for a selectedWallet.
    // If it is selected, it probably means a wallet was just pre created or
    // a refresh (common when in dev mode).
    if (getDaemonSynced || isSPV) {
      const selectedWallet = getSelectedWallet();
      return send({
        type: "CHOOSE_WALLET",
        selectedWallet,
        isSPV,
        isAdvancedDaemon
      });
    }
    send({ type: "START_SPV", isSPV });
    send({
      type: "START_ADVANCED_DAEMON",
      isSPV,
      isAdvancedDaemon
    });
    send({
      type: "START_REGULAR_DAEMON",
      isSPV,
      isAdvancedDaemon
    });
  }, [send, getDaemonSynced, getSelectedWallet, isAdvancedDaemon, isSPV]);

  useEffect(() => {
    preStartDaemon();
  });

  const onSendContinue = useCallback(() => send({ type: "CONTINUE" }), [send]);

  const onSendBack = useCallback(() => send({ type: "BACK" }), [send]);

  const onSendError = useCallback((error) => send({ type: "ERROR", error }), [
    send
  ]);

  const onSendCreateWallet = useCallback(
    (isNew) => send({ type: "CREATE_WALLET", isNew }),
    [send]
  );

  const onShowCreateWallet = useCallback(
    ({ isNew, walletMasterPubKey, isTrezor }) =>
      send({
        type: "SHOW_CREATE_WALLET",
        isNew,
        walletMasterPubKey,
        isTrezor
      }),
    [send]
  );

  const onShowReleaseNotes = useCallback(
    () => send({ type: "SHOW_RELEASE_NOTES" }),
    [send]
  );

  const submitChosenWallet = useCallback(
    (selectedWallet) => send({ type: "SUBMIT_CHOOSE_WALLET", selectedWallet }),
    [send]
  );

  const submitRemoteCredentials = useCallback(
    (remoteCredentials) => send({ type: "SUBMIT_REMOTE", remoteCredentials }),
    [send]
  );

  const submitAppdata = useCallback(
    (appdata) => send({ type: "SUBMIT_APPDATA", appdata }),
    [send]
  );

  const onShowTrezorConfig = useCallback(
    () => send({ type: "SHOW_TREZOR_CONFIG" }),
    [send]
  );

  const getStateComponent = useCallback(
    (updatedText, updatedAnimationType, updatedComponent) => {
      const { isCreateNewWallet, isSPV, createWalletRef } = state.context;
      let component, text, animationType, PageComponent;

      const key = Object.keys(state.value)[0];
      console.log({
        updatedText,
        updatedAnimationType,
        updatedComponent,
        key,
        value: state.value[key]
      });
      if (key === "startMachine") {
        switch (state.value[key]) {
          case "startAdvancedDaemon":
            component = AdvancedStartupBody;
            text = (
              <T
                id="loaderBar.WaitingDaemon"
                m="Waiting for daemon connection..."
              />
            );
            break;
          case "connectingDaemon":
            text = (
              <T id="loaderBar.WaitingConnection" m="connecting to daemon..." />
            );
            break;
          case "checkingNetworkMatch":
            text = (
              <T
                id="loaderBar.checkingNetwork"
                m="Checking if network matches..."
              />
            );
            break;
          case "startingDaemon":
            animationType = daemonWaiting;
            text = <T id="loaderBar.StartingDaemon" m="Starting Daemon..." />;
            break;
          case "syncingDaemon":
            animationType = blockChainLoading;
            text = <T id="loaderBar.syncingDaemon" m="Syncing Daemon..." />;
            break;
          case "choosingWallet":
            text = isSPV ? (
              <T
                id="loaderBar.choosingWalletSPV"
                m="Choose a wallet to open in SPV mode"
              />
            ) : (
              <T id="loaderBar.choosingWallet" m="Choose a wallet to open" />
            );
            component = h(WalletSelection, {
              onSendCreateWallet,
              submitChosenWallet,
              isSPV
            });
            break;
          case "preCreateWallet":
            text = isCreateNewWallet ? (
              <T id="loaderBar.preCreateWalletCreate" m="Create a wallet..." />
            ) : (
              <T
                id="loaderBar.preCreateWalletRestore"
                m="Restore a Wallet..."
              />
            );
            component = h(PreCreateWalletForm, {
              onShowCreateWallet,
              onSendContinue,
              onSendBack,
              onSendError,
              onShowTrezorConfig,
              isCreateNewWallet,
              error
            });
            break;
          case "walletPubpassInput":
            text = <T id="loaderBar.walletPubPass" m="Insert your pubkey" />;
            component = h(WalletPubpassInput, {
              onSendContinue,
              onSendError,
              error
            });
            break;
          case "startingWallet":
            text = <T id="loaderBar.startingWallet" m="Starting wallet..." />;
            break;
          case "syncingRPC":
            animationType = establishingRpc;
            text = (
              <T id="loaderBar.syncingRPC" m="Syncing RPC connection..." />
            );
            break;
        }
        PageComponent = h(GetStartedMachinePage, {
          submitRemoteCredentials,
          submitAppdata,
          error,
          isSPV,
          onShowReleaseNotes,
          // if updated* is set, we use it, as it means it is called by the componentDidUpdate.
          text: updatedText ? updatedText : text,
          animationType: updatedAnimationType
            ? updatedAnimationType
            : animationType,
          StateComponent: updatedComponent ? updatedComponent : component
        });
      }
      if (key === "settings") {
        PageComponent = h(Settings, { onSendBack });
      }
      if (key === "logs") {
        PageComponent = h(Logs, { onSendBack });
      }
      if (key === "trezorConfig") {
        PageComponent = h(TrezorConfig, { onSendBack });
      }
      if (key === "releaseNotes") {
        PageComponent = h(ReleaseNotes, { onSendBack });
      }
      if (key === "creatingWallet") {
        PageComponent = h(CreateWalletMachine, { createWalletRef, isTestNet });
      }

      setPageComponent(PageComponent);
    },
    [
      state,
      isTestNet,
      onSendBack,
      onSendContinue,
      onSendCreateWallet,
      onSendError,
      onShowCreateWallet,
      onShowReleaseNotes,
      onShowTrezorConfig,
      submitAppdata,
      submitChosenWallet,
      submitRemoteCredentials,
      error
    ]
  );

  useEffect(() => {
    let text, animationType, component;
    if (syncFetchMissingCfiltersAttempt) {
      animationType = daemonWaiting;
      text = (
        <T
          id="getStarted.header.fetchingMissing.meta"
          m="Fetching missing committed filters"
        />
      );
      getStateComponent(text, animationType, component);
    } else if (syncFetchHeadersAttempt) {
      animationType = fetchingHeaders;
      text = (
        <T
          id="getStarted.header.fetchingBlockHeaders.meta"
          m="Fetching block headers"
        />
      );
    } else if (syncDiscoverAddressesAttempt) {
      animationType = discoveringAddresses;
      text = (
        <T
          id="getStarted.header.discoveringAddresses.meta"
          m="Discovering addresses"
        />
      );
      getStateComponent(text, animationType, component);
    } else if (syncRescanAttempt) {
      animationType = scanningBlocks;
      text = (
        <T
          id="getStarted.header.rescanWallet.meta"
          m="Scanning blocks for transactions"
        />
      );
      component = RescanWalletBody;
      getStateComponent(text, animationType, component);
    } else if (synced) {
      animationType = finalizingSetup;
      text = (
        <T
          id="getStarted.header.finishingStart.meta"
          m="Finishing to load wallet"
        />
      );
      getStateComponent(text, animationType, component);
    } else if (state.value) {
      getStateComponent(text, animationType, component);
    }
  }, [
    syncFetchMissingCfiltersAttempt,
    syncFetchHeadersAttempt,
    syncDiscoverAddressesAttempt,
    syncRescanAttempt,
    synced,
    getStateComponent,
    state.value
  ]);

  const onShowSettings = useCallback(() => send({ type: "SHOW_SETTINGS" }), [
    send
  ]);

  const onShowLogs = useCallback(() => send({ type: "SHOW_LOGS" }), [send]);

  return (
    <GetStartedWrapper
      PageComponent={PageComponent}
      {...{ onShowLogs, onShowSettings, updateAvailable, isTestNet }}
    />
  );
};

export default injectIntl(daemonStartup(GetStarted));
