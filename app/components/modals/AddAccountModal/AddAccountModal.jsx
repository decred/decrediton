import Modal from "./AddAccountModalContent";
import useAddAccountModal from "./hooks";

function AddAccountModal({ onCancelModal, onSubmit, ...props }) {
  const {
    state,
    onCancelModalCallback,
    validationFailed,
    setName,
    onSubmitCallback,
    isValid
  } = useAddAccountModal(onCancelModal, onSubmit);

  return (
    <Modal
      {...{ ...props, ...state }}
      {...{
        setName,
        onSubmit: onSubmitCallback,
        onCancelModal: onCancelModalCallback,
        isValid,
        validationFailed
      }}
    />
  );
}

export default AddAccountModal;
