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
    onTypedConfirmationPhraseChanged,
    onSubmitCallback,
    onCancelModalCallback,
    ...state
  } = useSeedCopyConfirmModal(onSubmit, onCancelModal, message);

  return (
    <Modal
      {...{ ...props, ...state }}
      {...{
        onTypedConfirmationPhraseChanged,
        onSubmit: onSubmitCallback,
        onCancelModal: onCancelModalCallback
      }}
    />
  );
};

export default SeedCopyConfirmModal;
