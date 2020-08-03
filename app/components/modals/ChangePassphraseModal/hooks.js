import { useState, useCallback, useMemo } from "react";

function useChangePassphraseModal(onCancelModal, onSubmit) {
  const [privPass, setPrivPass] = useState("");
  const [confirmPrivPass, setConfirmPrivPass] = useState("");
  const [confirmPrivPassError, setConfirmPrivPassError] = useState(false);
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);
  const [triggerPassphraseModalSubmit, setTriggerPassphraseModalSubmit] = useState(false);

  const resetState = useCallback(() => {
    setPrivPass("");
    setConfirmPrivPass("");
    setConfirmPrivPassError(false);
    setHasFailedAttempt(false);
    setTriggerPassphraseModalSubmit(false);
  }, []);

  const onCancelModalCallback = useCallback(() => {
    resetState();
    onCancelModal && onCancelModal();
  }, [resetState, onCancelModal]);

  const validationFailed = useCallback(() => {
    setHasFailedAttempt(true);
    setConfirmPrivPassError(privPass !== confirmPrivPass);
  }, [privPass, confirmPrivPass]);

  const isValid = useMemo(() => {
    return (
      !!privPass &&
      privPass === confirmPrivPass
    );
  }, [privPass, confirmPrivPass]);

  const onSubmitCallback = useCallback((passPhrase) => {
    onSubmit(passPhrase, privPass, true);
    resetState();
  }, [privPass, onSubmit, resetState]);

  const updatePrivatePassphrase = useCallback((privPass) => {
    if (privPass == "") setHasFailedAttempt(true);
    setPrivPass(privPass);
    setTriggerPassphraseModalSubmit(false);
  }, []);

  const updateConfirmPrivatePassphrase = useCallback((confirmPrivPass) => {
    if (confirmPrivPass == "") setHasFailedAttempt(true);
    setConfirmPrivPass(confirmPrivPass);
    setConfirmPrivPassError(false);
    setTriggerPassphraseModalSubmit(false);
  }, []);

  const onTriggerPassphraseModalSubmit = useCallback(() => {
    setTriggerPassphraseModalSubmit(true);
  }, []);

  return {
    privPass,
    confirmPrivPass,
    confirmPrivPassError,
    hasFailedAttempt,
    triggerPassphraseModalSubmit,
    onCancelModalCallback,
    validationFailed,
    isValid,
    onSubmitCallback,
    updatePrivatePassphrase,
    updateConfirmPrivatePassphrase,
    onTriggerPassphraseModalSubmit
  };
}

export default useChangePassphraseModal;
