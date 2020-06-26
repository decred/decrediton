import Modal from "./ChangePassphraseModalContent";
import useChangePassphraseModal from "./hooks";

const ChangePassphraseModal = ({ onCancelModal, onSubmit, ...props }) => {
  const {
    privPass,
    confirmPrivPass,
    confirmPrivPassError,
    hasFailedAttempt,
    triggerPassphraseModalSubmit,
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
      {...props}
      {...{
        privPass,
        confirmPrivPass,
        confirmPrivPassError,
        hasFailedAttempt,
        triggerPassphraseModalSubmit,
        onCancelModal: onCancelModalCallback,
        validationFailed,
        isValid,
        onSubmit: onSubmitCallback,
        updatePrivatePassphrase,
        updateConfirmPrivatePassphrase,
        onTriggerPassphraseModalSubmit
      }}
    />
  );
};

export default ChangePassphraseModal;
