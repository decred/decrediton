import Modal from "./ImportScriptModalContent";
import useImportScriptModal from "./hooks";

const ImportScriptModal = ({ onCancelModal, onSubmit, ...props }) => {
  const {
    script,
    hasFailedAttempt,
    onCancelModalCallback,
    validationFailed,
    setScriptCallback,
    onSubmitCallback,
    isValid
  } = useImportScriptModal(onCancelModal, onSubmit);

  return (
    <Modal
      {...props}
      {...{
        script,
        hasFailedAttempt,
        onCancelModal: onCancelModalCallback,
        validationFailed,
        setScript: setScriptCallback,
        onSubmit: onSubmitCallback,
        isValid
      }}
    />
  );
};

export default ImportScriptModal;
