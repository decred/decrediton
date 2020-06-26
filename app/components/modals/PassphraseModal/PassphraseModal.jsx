import Modal from "./PassphraseModalContent";
import usePassphraseModal from "./hooks";

const PassphraseModal = ({
  triggerSubmit,
  onCancelModal,
  isValid,
  validationFailed,
  onSubmit,
  ...props
}) => {
  const {
    passPhrase,
    hasFailedAttempt,
    onCancelModalCallback,
    setPassPhraseCallback,
    isValidCallback,
    onSubmitCallback
  } = usePassphraseModal(
    triggerSubmit,
    onCancelModal,
    isValid,
    validationFailed,
    onSubmit
  );

  return (
    <Modal
      {...props}
      {...{
        passPhrase,
        hasFailedAttempt,
        onCancelModal: onCancelModalCallback,
        setPassPhrase: setPassPhraseCallback,
        isValid: isValidCallback,
        onSubmit: onSubmitCallback
      }}
    />
  );
};

export default PassphraseModal;
