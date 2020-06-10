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
    onCancelModalCallback,
    setPassPhraseCallback,
    isValidCallback,
    onSubmitCallback,
    ...state
  } = usePassphraseModal(
    triggerSubmit,
    onCancelModal,
    isValid,
    validationFailed,
    onSubmit
  );

  return (
    <Modal
      {...{ ...props, ...state }}
      {...{
        setPassPhrase: setPassPhraseCallback,
        onSubmit: onSubmitCallback,
        onCancelModal: onCancelModalCallback,
        isValid: isValidCallback
      }}
    />
  );
};

export default PassphraseModal;
