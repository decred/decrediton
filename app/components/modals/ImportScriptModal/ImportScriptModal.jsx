import Modal from "./ImportScriptModalContent";
import useImportScriptModal from "./hooks";

function ImportScriptModal({ onCancelModal, onSubmit, ...props }) {
  const {
    state,
    onCancelModalCallback,
    validationFailed,
    setScript,
    onSubmitCallback,
    isValid
  } = useImportScriptModal(onCancelModal, onSubmit);

  return (
    <Modal
      {...{ ...props, ...state }}
      {...{
        setScript,
        onSubmit: onSubmitCallback,
        onCancelModal: onCancelModalCallback,
        isValid,
        validationFailed
      }}
    />
  );
}

export default ImportScriptModal;
