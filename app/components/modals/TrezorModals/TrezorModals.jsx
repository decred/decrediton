import { useMemo } from "react";
import { useTrezor } from "hooks";
import PinModal from "./TrezorPinModal";
import PassPhraseModal from "./TrezorPassphraseModal";
import WalletCreationPassPhraseModal from "./TrezorWalletCreationPassphraseModal";
import WordModal from "./TrezorWordModal";

const TrezorModals = () => {
  const {
    isTrezor,
    waitingForPin,
    waitingForPassPhrase,
    waitingForWord,
    walletCreationMasterPubkeyAttempt,
    onCancelCurrentOperation,
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
      default:
        return null;
    }
  }, [
    waitingForPin,
    waitingForPassPhrase,
    walletCreationMasterPubkeyAttempt,
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
        walletCreationMasterPubkeyAttempt
      }}
      onCancelModal={onCancelCurrentOperation}
    />
  ) : null;
};

export default TrezorModals;
