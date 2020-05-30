import { injectIntl } from "react-intl";
import "style/GetStarted.less";
import Page from "./Page";
import { withRouter } from "react-router";
import CopySeed from "./CopySeed";
import ConfirmSeed from "./ConfirmSeed";
import ExistingSeed from "./ExistingSeed";
import { createWallet } from "connectors";
import { createElement as h } from "react";
import { DecredLoading } from "indicators";
import { useState, useEffect, useCallback } from "react";
import { useService } from "@xstate/react";
import { useSelector, useDispatch } from "react-redux";
import * as wla from "actions/WalletLoaderActions";
import * as sel from "selectors";
import { sendParent } from "xstate";

const CreateWallet = ({ createWalletRef }) => {
  // const isCreatingWatchingOnly = useSelector(sel.isWatchingOnly);
  // const walletMasterPubKey = useSelector(sel.walletMasterPubKey);
  // const maxWalletCount= useSelector(sel.maxWalletCount);
  // const trezorDeviceList = useSelector(sel.trezorDeviceList);
  // const trezorDevice = useSelector(sel.trezorDevice);
  // const isTrezor = useSelector(sel.isTrezor);

  const dispatch = useDispatch();
  const decodeSeed = useCallback((seed) => dispatch(wla.decodeSeed(seed)), [
    dispatch
  ]);
  const cancelCreateWallet = useCallback(
    () => dispatch(wla.cancelCreateWallet()),
    [dispatch]
  );
  const generateSeed = useCallback(() => dispatch(wla.generateSeed()), [
    dispatch
  ]);
  // TODO implement pubpass
  const createWatchOnlyWalletRequest = useCallback(
    (extendedPubKey, pubPass = "") =>
      dispatch(wla.createWatchOnlyWalletRequest(extendedPubKey, pubPass)),
    [dispatch]
  );
  const createWalletRequest = useCallback(
    (pubpass, passPhrase, seed, isNew) =>
      dispatch(wla.createWalletRequest(pubpass, passPhrase, seed, isNew)),
    [dispatch]
  );
  const isTestNet = useSelector(sel.isTestNet);
  const [current, send] = useService(createWalletRef);
  const [StateComponent, setStateComponent] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [newWallet, setIsNew] = useState(null);
  const [walletMasterPubKey, setWalletMasterPubkey] = useState(null);

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

  const sendBack = useCallback(() => {
    send({ type: "BACK" });
  }, [send]);

  const cancelWalletCreation = useCallback(async () => {
    await cancelCreateWallet();
    send({ type: "BACK" });
  }, [send, cancelCreateWallet]);

  const setError = useCallback(
    (error) => {
      send({ type: "VALIDATE_DATA", error });
    },
    [send]
  );

  const setSeed = useCallback(
    (seed) => {
      const { passPhrase, error } = current.context;
      send({ type: "VALIDATE_DATA", seed, passPhrase, error });
    },
    [send, current.context]
  );

  const setPassPhrase = useCallback(
    (passPhrase) => {
      const { seed, error } = current.context;
      send({ type: "VALIDATE_DATA", passPhrase, seed, error });
    },
    [send, current.context]
  );

  const checkIsValid = useCallback(() => {
    const { seed, passPhrase } = current.context;
    // We validate our seed and passphrase at their specific components
    // So if they are set at the machine it means they have passed validation.
    if (!seed || !passPhrase) return setIsValid(false);
    if (seed.length === 0) return setIsValid(false);
    if (passPhrase.length === 0) return setIsValid(false);

    return setIsValid(true);
  }, [setIsValid, current.context]);

  const onCreateWallet = useCallback(() => {
    const pubpass = ""; // Temporarily disabled?
    const { seed, passPhrase } = current.context;

    if (!(seed && passPhrase)) return;
    createWalletRequest(pubpass, passPhrase, seed, newWallet)
      .then(() => sendEvent({ type: "WALLET_CREATED" }))
      .catch((error) => sendParent({ type: "ERROR", error }));
    // we send a continue so we go to loading state
    sendContinue();
  }, [
    createWalletRequest,
    current.context,
    newWallet,
    sendContinue,
    sendEvent
  ]);

  const onCreateWatchOnly = useCallback(() => {
    createWatchOnlyWalletRequest(walletMasterPubKey)
      .then(() => sendEvent({ type: "WALLET_CREATED" }))
      .catch((error) => sendEvent({ type: "ERROR", error }));
    // we send a continue so we go to loading state
    sendContinue();
  }, [
    createWatchOnlyWalletRequest,
    sendEvent,
    sendContinue,
    walletMasterPubKey
  ]);

  const getStateComponent = useCallback(() => {
    const { mnemonic, error } = current.context;
    let component;

    switch (current.value) {
      case "newWallet":
        component = h(CopySeed, {
          sendBack: cancelWalletCreation,
          sendContinue,
          mnemonic
        });
        break;
      case "confirmSeed":
        if (!mnemonic) return;
        component = h(ConfirmSeed, {
          mnemonic,
          sendBack,
          setPassPhrase,
          onCreateWallet,
          isValid,
          decodeSeed,
          setSeed,
          setError
        });
        break;
      case "writeSeed":
        component = h(ExistingSeed, {
          sendBack: cancelWalletCreation,
          decodeSeed,
          sendContinue,
          setSeed,
          setPassPhrase,
          onCreateWallet,
          isValid,
          setError,
          error
        });
        break;
      case "restoreWatchingOnly":
        component = h(DecredLoading);
        break;
      case "loading": {
        component = h(DecredLoading);
        break;
      }
      case "finished":
        break;
      case "walletCreated":
        break;
    }

    return setStateComponent(component);
  }, [
    cancelWalletCreation,
    current.context,
    current.value,
    decodeSeed,
    isValid,
    onCreateWallet,
    sendBack,
    sendContinue,
    setError,
    setPassPhrase,
    setSeed
  ]);

  useEffect(() => {
    const { isNew, walletMasterPubKey, mnemonic } = current.context;
    switch (current.value) {
      case "createWalletInit":
        setIsNew(isNew);
        setWalletMasterPubkey(walletMasterPubKey);
        send({ type: "CREATE_WALLET", isNew });
        send({
          type: "RESTORE_WATCHING_ONLY_WALLET",
          isWatchingOnly: !!walletMasterPubKey
        });
        send({
          type: "RESTORE_WALLET",
          isRestore: !isNew,
          isWatchingOnly: !!walletMasterPubKey
        });
        break;
      case "generateNewSeed":
        // We only generate the seed once. If mnemonic already exists, we return it.
        if (mnemonic) return;
        sendContinue();
        generateSeed().then((response) => {
          // Allows verification skip in dev
          const seed = isTestNet ? response.getSeedBytes() : null;
          const mnemonic = response.getSeedMnemonic();
          sendEvent({ type: "SEED_GENERATED", payload: { mnemonic, seed } });
        });
        break;
      case "writeSeed":
        checkIsValid();
        break;
      case "confirmSeed":
        checkIsValid();
        break;
      case "restoreWatchingOnly":
        onCreateWatchOnly();
        break;
      case "finished":
        break;
      case "walletCreated":
        break;
    }
    getStateComponent();
  }, [
    current,
    isValid,
    checkIsValid,
    generateSeed,
    getStateComponent,
    isTestNet,
    onCreateWatchOnly,
    send,
    sendContinue,
    sendEvent
  ]);

  return <Page {...{ StateComponent }} />;
};

export default injectIntl(withRouter(createWallet(CreateWallet)));
