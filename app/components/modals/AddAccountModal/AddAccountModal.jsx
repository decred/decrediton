import Modal from "./AddAccountModalContent";
import useAddAccountModal from "./hooks";

function AddAccountModal({ onCancelModal, onSubmit, ...props }) {
  const {
    onCancelModalCallback,
    validationFailed,
    setNameCallback,
    onSubmitCallback,
    isValid,
    ...state
  } = useAddAccountModal(onCancelModal, onSubmit);

  return (
    <Modal
      {...{ ...props, ...state }}
      {...{
        setName: setNameCallback,
        onSubmit: onSubmitCallback,
        onCancelModal: onCancelModalCallback,
        isValid,
        validationFailed
      }}
    />
  );
}

export default AddAccountModal;
