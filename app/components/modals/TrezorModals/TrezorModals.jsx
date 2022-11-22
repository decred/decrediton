import { useMemo, useState, useEffect } from "react";
import { useTrezor } from "hooks";
import PinModal from "./TrezorPinModal";
import PassPhraseModal from "./TrezorPassphraseModal";
import WalletCreationPassPhraseModal from "./TrezorWalletCreationPassphraseModal";
import TogglePassphraseConfirmModal from "./TrezorTogglePassphraseConfirmModal";
import WordModal from "./TrezorWordModal";

const TrezorModals = () => {
  const {
    isTrezor,
    waitingForPin,
    waitingForPassPhrase,
    waitingForWord,
    walletCreationMasterPubkeyAttempt,
    onCancelCurrentOperation,
    confirmingTogglePassphrase,
    performingRecoverDevice,
    ...props
  } = useTrezor();

  const [wordAlreadyHasBeenRequested, setWordAlreadyHasBeenRequested] =
    useState(false);
  useEffect(() => {
    if (waitingForWord) {
      setWordAlreadyHasBeenRequested(true);
    }
    if (!performingRecoverDevice) {
      setWordAlreadyHasBeenRequested(false);
    }
  }, [waitingForWord, performingRecoverDevice, onCancelCurrentOperation]);

  const onCancelModal = () => {
    onCancelCurrentOperation();
    setWordAlreadyHasBeenRequested(false);
  };

  const Component = useMemo(() => {
    switch (true) {
      case waitingForPin:
        return PinModal;
      case waitingForPassPhrase:
        return walletCreationMasterPubkeyAttempt
          ? WalletCreationPassPhraseModal
          : PassPhraseModal;
      case performingRecoverDevice:
        // show the `WordModal` just after the user confirms the restore
        // process, and the first word is requested
        return wordAlreadyHasBeenRequested && WordModal;
      case confirmingTogglePassphrase:
        return TogglePassphraseConfirmModal;
      default:
        return null;
    }
  }, [
    waitingForPin,
    waitingForPassPhrase,
    walletCreationMasterPubkeyAttempt,
    confirmingTogglePassphrase,
    performingRecoverDevice,
    wordAlreadyHasBeenRequested
  ]);

  return Component && isTrezor ? (
    <Component
      {...{
        ...props,
        isTrezor,
        waitingForPin,
        waitingForPassPhrase,
        waitingForWord,
        confirmingTogglePassphrase,
        walletCreationMasterPubkeyAttempt
      }}
      onCancelModal={onCancelModal}
    />
  ) : null;
};

export default TrezorModals;
