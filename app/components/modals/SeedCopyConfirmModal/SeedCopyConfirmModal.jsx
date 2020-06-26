import Modal from "./SeedCopyConfirmModalContent";
import useSeedCopyConfirmModal from "./hooks";
import { defineMessages } from "react-intl";

const message = defineMessages({
  copyConfirmationPhrase: {
    id: "seedCopyConfirmModal.copyConfirmationPhrase",
    defaultMessage: "I understand the risks"
  }
});

const SeedCopyConfirmModal = ({ onSubmit, onCancelModal, ...props }) => {
  const {
    copyConfirmationPhrase,
    typedConfirmationPhrase,
    onTypedConfirmationPhraseChanged,
    onSubmitCallback,
    onCancelModalCallback
  } = useSeedCopyConfirmModal(onSubmit, onCancelModal, message);

  return (
    <Modal
      {...props}
      {...{
        copyConfirmationPhrase,
        typedConfirmationPhrase,
        onTypedConfirmationPhraseChanged,
        onSubmit: onSubmitCallback,
        onCancelModal: onCancelModalCallback
      }}
    />
  );
};

export default SeedCopyConfirmModal;
