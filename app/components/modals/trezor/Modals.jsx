import PinModal from "./PinModal";
import PassPhraseModal from "./PassPhraseModal";
import WalletCreationPassPhraseModal from "./WalletCreationPassPhraseModal";
import WordModal from "./WordModal";
import { useTrezor } from "hooks";

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

  if (!Component) return null;
  return isTrezor ? (
    <Component
      {...{
        ...props,
        isTrezor,
        waitingForPin,
        waitingForPassPhrase,
        waitingForWord,
        walletCreationMasterPubkeyAttempt,
      }}
      onCancelModal={onCancelCurrentOperation}
    />
  ) : null;
};

export default TrezorModals;
