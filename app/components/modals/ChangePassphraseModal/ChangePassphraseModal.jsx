import Modal from "./ChangePassphraseModalContent";
import useChangePassphraseModal from "./hooks";

function ChangePassphraseModal({ onCancelModal, onSubmit, ...props }) {
  const {
    state,
    onCancelModalCallback,
    validationFailed,
    isValid,
    onSubmitCallback,
    updatePrivatePassphrase,
    updateConfirmPrivatePassphrase,
    onTriggerPassphraseModalSubmit
  } = useChangePassphraseModal(onCancelModal, onSubmit);

  return (
    <Modal
      {...{ ...props, ...state }}
      {...{
        updatePrivatePassphrase,
        updateConfirmPrivatePassphrase,
        onSubmit: onSubmitCallback,
        onCancelModal: onCancelModalCallback,
        isValid,
        validationFailed,
        onTriggerPassphraseModalSubmit
      }}
    />
  );
}

export default ChangePassphraseModal;
