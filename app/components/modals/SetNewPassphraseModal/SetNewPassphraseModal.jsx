import Modal from "./SetNewPassphraseModalContent";
import { useState, useCallback } from "react";
import { useEffect } from "react";

const SetNewPassphraseModal = ({ onCancelModal, onSubmit, ...props }) => {
  const [confirmPrivPass, setConfirmPrivPass] = useState(null);
  const [passPhrase, setPassPhrase] = useState(null);
  const [isValid, setIsValid] = useState(null);

  const resetState = useCallback(() => {
    setPassPhrase(null);
    setConfirmPrivPass(null);
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

  useEffect(() => {
    setIsValid(!!passPhrase && passPhrase === confirmPrivPass);
  }, [passPhrase, confirmPrivPass]);

  return (
    <Modal
      {...props}
      {...{
        passPhrase,
        confirmPrivPass,
        onCancelModal: onCancelModalCallback,
        setPassPhrase,
        isValid,
        onSubmit: onSubmitCallback,
        setConfirmPrivPass
      }}
    />
  );
};

export default SetNewPassphraseModal;
