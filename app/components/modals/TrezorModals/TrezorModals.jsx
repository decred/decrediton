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

  let Component = null;

  if (waitingForPin) {
    Component = PinModal;
  } else if (waitingForPassPhrase) {
    if (walletCreationMasterPubkeyAttempt) {
      Component = WalletCreationPassPhraseModal;
    } else {
      Component = PassPhraseModal;
    }
  } else if (waitingForWord) {
    Component = WordModal;
  }

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
