import { injectIntl } from "react-intl";
import "style/GetStarted.less";
import cx from "classnames";
import { CreateWalletMachine } from "stateMachines/CreateWalletStateMachine";
import Page from "./Page";
import { withRouter } from "react-router";
import CopySeed from "./CopySeed";
import ConfirmSeed from "./ConfirmSeed";
import ExistingSeed from "./ExistingSeed";
import { createWallet } from "connectors";
import { createElement as h } from "react";
import { DecredLoading } from "indicators";
import { useState, useEffect, useRef } from "react";
import { useService } from "@xstate/react";
import { useSelector, useDispatch } from "react-redux";
import * as wla from "actions/WalletLoaderActions";
import * as sel from "selectors";
import {sendParent} from "xstate"

  // onCreateWatchOnly() {
  //   const { createWatchOnlyWalletRequest, walletMasterPubKey } = this.props;
  //   createWatchOnlyWalletRequest(walletMasterPubKey)
  //     .then(() => this.sendContinue())
  //     .catch((error) => this.sendEvent({ type: "ERROR", error }));
  //   // we send a continue so we go to creatingWallet state
  //   this.sendContinue();
  // }

const CreateWallet = ({ createWalletRef, ...props }) => {
  // const isCreatingWatchingOnly = useSelector(sel.isWatchingOnly);
  // const walletMasterPubKey = useSelector(sel.walletMasterPubKey);
  // const maxWalletCount= useSelector(sel.maxWalletCount);
  // const trezorDeviceList = useSelector(sel.trezorDeviceList);
  // const trezorDevice = useSelector(sel.trezorDevice);
  // const isTrezor = useSelector(sel.isTrezor);

  const dispatch = useDispatch();
  const decodeSeed = (seed) => dispatch(wla.decodeSeed(seed));
  const cancelCreateWallet = () => dispatch(wla.cancelCreateWallet());
  const generateSeed = () => dispatch(wla.generateSeed());
  const createWalletRequest = (pubpass, passPhrase, seed, isNew) => dispatch(wla.createWalletRequest(pubpass, passPhrase, seed, isNew));
  const isTestNet = useSelector(sel.isTestNet);
  const [current, send] = useService(createWalletRef);
  const [StateComponent, setStateComponent] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [newWallet, setIsNew] = useState(null);

  const {
    getDaemonSynced,
    getCurrentBlockCount,
    getNeededBlocks,
    getEstimatedTimeLeft,
  } = props;

  const sendEvent = (data) => {
    const { type, payload } = data;
    send({ type, payload });
  }

  const sendContinue = () => {
    send({ type: "CONTINUE" });
  }

  const sendBack = () => {
    send({ type: "BACK" });
  }

  const cancelWalletCreation = async () => {
    await cancelCreateWallet();
    send({ type: "BACK" });
  }

  const setError = (error) => {
    send({ type: "VALIDATE_DATA", error });
  }

  const setSeed = (seed) => {
    const { passPhrase, error } = current.context;
    send({ type: "VALIDATE_DATA", seed, passPhrase, error });
  }

  const setPassPhrase = (passPhrase) => {
    const { seed, error } = current.context;
    send({ type: "VALIDATE_DATA", passPhrase, seed, error });
  }

  const checkIsValid = () => {
    const { seed, passPhrase } = current.context;
    // We validate our seed and passphrase at their specific components
    // So if they are set at the machine it means they have passed validation.
    if (!seed || !passPhrase) return setIsValid(false);
    if (seed.length === 0) return setIsValid(false);
    if (passPhrase.length === 0) return setIsValid(false);

    return setIsValid(true);
  }

  const onCreateWallet = () => {
    const pubpass = ""; // Temporarily disabled?
    const { seed, passPhrase } = current.context;

    if (!(seed && passPhrase)) return;
    createWalletRequest(pubpass, passPhrase, seed, newWallet)
      .then(() => sendEvent({ type: "WALLET_CREATED" }))
      .catch((error) => sendParent({ type: "ERROR", error }));
    // we send a continue so we go to loading state
    sendContinue();
  }

  const getStateComponent = () => {
    const { mnemonic, error } = current.context;
    let component, text;

    switch (current.value) {
      case "newWallet":
        component = h(CopySeed, { sendBack: cancelWalletCreation, sendContinue, mnemonic });
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
      case "loading": {
        component = h(DecredLoading, { ...props, isCreatingWallet: true });
        break;
      }
      case "finished":
        break;
      case "walletCreated":
        break;
    }

    return setStateComponent(component);
  }

  useEffect(() => {
    const { isNew, passPhrase, mnemonic } = current.context;
    switch (current.value) {
      case "createWalletInit":
        setIsNew(isNew)
        console.log(current.context)
        const { isTrezor, isCreatingWatchingOnly } = props;
        send({ type: "CREATE_WALLET", isNew });
        send({ type: "RESTORE_WATCHING_ONLY_WALLET", isWatchingOnly: isCreatingWatchingOnly });
        send({ type: "RESTORE_TREZOR_WALLET", isTrezor });
        send({
          type: "RESTORE_WALLET",
          isRestore: !isNew,
          isWatchingOnly: isCreatingWatchingOnly
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
      case "finished":
        break;
      case "walletCreated":
        break;
    }
    getStateComponent();
  }, [current, isValid]);

  return (
    <Page
      {...{
        StateComponent,
        // getCurrentBlockCount,
        // getNeededBlocks,
        // getEstimatedTimeLeft,
        // getDaemonSynced,
        // walletHeader
      }}
    />
  );
}

export default injectIntl(withRouter(createWallet(CreateWallet)));
