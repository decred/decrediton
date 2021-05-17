import { useMemo } from "react";
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
    ...props
  } = useTrezor();

  const Component = useMemo(() => {
    switch (true) {
      case waitingForPin:
        return PinModal;
      case waitingForPassPhrase:
        return walletCreationMasterPubkeyAttempt
          ? WalletCreationPassPhraseModal
          : PassPhraseModal;
      case waitingForWord:
        return WordModal;
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
    waitingForWord
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
      onCancelModal={onCancelCurrentOperation}
    />
  ) : null;
};

export default TrezorModals;
