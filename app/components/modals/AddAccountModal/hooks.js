import { useState, useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

function useAddAccountModal(onCancelModal, onSubmit) {
  const [name, setName] = useState("");
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);
  const intl = useIntl();

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

  const onSubmitCallback = useCallback(
    (passPhrase) => {
      onSubmit(passPhrase, name);
      resetState();
    },
    [resetState, name, onSubmit]
  );

  const isValid = useMemo(() => !!name, [name]);

  return {
    name,
    hasFailedAttempt,
    onCancelModalCallback,
    validationFailed,
    setNameCallback,
    onSubmitCallback,
    isValid,
    intl
  };
}

export default useAddAccountModal;
