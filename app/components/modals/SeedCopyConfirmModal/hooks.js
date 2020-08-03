import { useState, useCallback } from "react";
import { useIntl } from "react-intl";

function useSeedCopyConfirmModal(onSubmit, onCancelModal, message) {
  const intl = useIntl();

  const [copyConfirmationPhrase] = useState(
    intl.formatMessage(
      message.copyConfirmationPhrase
    )
  );

  const [typedConfirmationPhrase, setTypedConfirmationPhrase] = useState("");

  const onTypedConfirmationPhraseChanged = useCallback((typedConfirmationPhrase) =>
    setTypedConfirmationPhrase(typedConfirmationPhrase)
    , []);

  const onSubmitCallback = useCallback(() => {
    onSubmit();
    setTypedConfirmationPhrase("");
  }, [onSubmit]);

  const onCancelModalCallback = useCallback(() => {
    onCancelModal();
    setTypedConfirmationPhrase("");
  }, [onCancelModal]);

  return {
    copyConfirmationPhrase,
    typedConfirmationPhrase,
    onTypedConfirmationPhraseChanged,
    onSubmitCallback,
    onCancelModalCallback
  };
}

export default useSeedCopyConfirmModal;
