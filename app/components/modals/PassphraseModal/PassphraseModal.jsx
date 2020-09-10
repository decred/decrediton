import Modal from "./PassphraseModalContent";
import { useState, useCallback } from "react";
import { useEffect } from "react";

const PassphraseModal = ({
  onCancelModal,
  onSubmit,
  parentIsValid,
  ...props
}) => {
  const [passPhrase, setPassPhrase] = useState("");
  const [isValid, setIsValid] = useState(false);

  const resetState = useCallback(() => {
    setPassPhrase("");
  }, []);

  const onCancelModalCallback = useCallback(() => {
    resetState();
    onCancelModal && onCancelModal();
  }, [resetState, onCancelModal]);

  const onSubmitCallback = useCallback(() => {
    if (!isValid) {
      return;
    }

    onSubmit(passPhrase);
    resetState();
  }, [passPhrase, onSubmit, resetState, isValid]);

  useEffect(() => setIsValid(parentIsValid && !!passPhrase), [passPhrase, parentIsValid]);

  return (
    <Modal
      {...props}
      {...{
        passPhrase,
        onCancelModal: onCancelModalCallback,
        setPassPhrase,
        isValid,
        onSubmit: onSubmitCallback
      }}
    />
  );
};

export default PassphraseModal;
