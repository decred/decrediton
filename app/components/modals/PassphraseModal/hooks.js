import { useEffect, useState, useCallback, useMemo } from "react";

function usePassphraseModal(
  triggerSubmit,
  onCancelModal,
  isValid,
  validationFailed,
  onSubmit
) {
  const [passPhrase, setPassPhrase] = useState("");
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);

  const resetState = useCallback(() => {
    setPassPhrase("");
    setHasFailedAttempt(false);
  }, []);

  const onCancelModalCallback = useCallback(() => {
    resetState();
    onCancelModal && onCancelModal();
  }, [resetState, onCancelModal]);

  const setPassPhraseCallback = useCallback((passPhrase) => {
    if (passPhrase == "") setHasFailedAttempt(true);
    setPassPhrase(passPhrase);
  }, []);

  const isValidCallback = useMemo(() => {
    const parentValid = isValid != undefined ? isValid : true;
    return !!passPhrase && parentValid;
  }, [passPhrase, isValid]);

  const onSubmitCallback = useCallback(() => {
    if (!isValidCallback) {
      validationFailed && validationFailed();
      return setHasFailedAttempt(true);
    }

    onSubmit(passPhrase);
    resetState();
  }, [passPhrase, validationFailed, isValidCallback, onSubmit, resetState]);

  useEffect(() => {
    if (triggerSubmit) onSubmitCallback();
  }, [triggerSubmit, onSubmitCallback]);

  return {
    passPhrase,
    hasFailedAttempt,
    onCancelModalCallback,
    setPassPhraseCallback,
    isValidCallback,
    onSubmitCallback
  };
}

export default usePassphraseModal;
