import { useState, useCallback, useEffect } from "react";

export const useSetNewPassphraseModal = ({ onCancelModal, onSubmit }) => {
  const [confirmPrivPass, setConfirmPrivPass] = useState(null);
  const [passphrase, setPassphrase] = useState(null);
  const [isValid, setIsValid] = useState(null);

  const resetState = useCallback(() => {
    setPassphrase(null);
    setConfirmPrivPass(null);
  }, []);

  const onCancelModalCallback = useCallback(() => {
    resetState();
    onCancelModal?.();
  }, [resetState, onCancelModal]);

  const onSubmitCallback = useCallback(() => {
    if (!isValid) {
      return;
    }

    onSubmit(passphrase);
    resetState();
  }, [passphrase, onSubmit, resetState, isValid]);

  useEffect(() => {
    setIsValid(!!passphrase && passphrase === confirmPrivPass);
  }, [passphrase, confirmPrivPass]);

  return {
    passphrase,
    confirmPrivPass,
    onCancelModalCallback,
    setPassphrase,
    isValid,
    onSubmitCallback,
    setConfirmPrivPass
  };
};
