import Modal from "./ImportScriptModalContent";
import useImportScriptModal from "./hooks";

const ImportScriptModal = ({ onCancelModal, onSubmit, ...props }) => {
  const {
    onCancelModalCallback,
    validationFailed,
    setScriptCallback,
    onSubmitCallback,
    isValid,
    ...state
  } = useImportScriptModal(onCancelModal, onSubmit);

  return (
    <Modal
      {...{ ...props, ...state }}
      {...{
        setScript: setScriptCallback,
        onSubmit: onSubmitCallback,
        onCancelModal: onCancelModalCallback,
        isValid,
        validationFailed
      }}
    />
  );
}

export default ImportScriptModal;
