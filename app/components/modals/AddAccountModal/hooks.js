import { useState, useCallback } from "react";

function useAddAccountModal(onCancelModal, onSubmit) {
  const [name, setName] = useState("");
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);

  const resetState = useCallback(() => {
    setName("");
    setHasFailedAttempt(false);
  }, []);

  const onCancelModalCallback = useCallback(() => {
    resetState();
    onCancelModal && onCancelModal();
  }, [onCancelModal, resetState]);

  const validationFailed = useCallback(() => {
    setHasFailedAttempt(true);
  }, []);

  const setNameCallback = useCallback((name) => {
    if (name == "") setHasFailedAttempt(true);
    setName(name);
  }, []);

  const onSubmitCallback = useCallback((passPhrase) => {
    onSubmit(passPhrase, name);
    resetState();
  }, [resetState, name, onSubmit]);

  const isValid = useCallback(() =>
    !!name
    , [name]);

  return {
    name,
    hasFailedAttempt,
    onCancelModalCallback,
    validationFailed,
    setNameCallback,
    onSubmitCallback,
    isValid
  };
}

export default useAddAccountModal;
