import Modal from "./AddAccountModalContent";
import useAddAccountModal from "./hooks";

const AddAccountModal = ({ onCancelModal, onSubmit, ...props }) => {
  const {
    name,
    hasFailedAttempt,
    onCancelModalCallback,
    validationFailed,
    setNameCallback,
    onSubmitCallback,
    isValid
  } = useAddAccountModal(onCancelModal, onSubmit);

  return (
    <Modal
      {...props}
      {...{
        name,
        hasFailedAttempt,
        onCancelModal: onCancelModalCallback,
        validationFailed,
        setName: setNameCallback,
        onSubmit: onSubmitCallback,
        isValid
      }}
    />
  );
};

export default AddAccountModal;
