import { useState, useCallback, useMemo } from "react";

function useImportScriptModal(onCancelModal, onSubmit) {
  const [script, setScript] = useState("");
  const [hasFailedAttempt, setHasFailedAttempt] = useState(false);

  const resetState = useCallback(() => {
    setScript("");
    setHasFailedAttempt(false);
  }, []);

  const onCancelModalCallback = useCallback(() => {
    resetState();
    onCancelModal && onCancelModal();
  }, [resetState, onCancelModal]);

  const validationFailed = useCallback(() => {
    setHasFailedAttempt(true);
  }, []);

  const setScriptCallback = useCallback((script) => {
    if (script == "") setHasFailedAttempt(true);
    setScript(script);
  }, []);

  const onSubmitCallback = useCallback(() => {
    onSubmit(script);
    resetState();
  }, [resetState, script, onSubmit]);

  const isValid = useMemo(() =>
    !!script
    , [script]);

  return {
    script,
    hasFailedAttempt,
    onCancelModalCallback,
    validationFailed,
    setScriptCallback,
    onSubmitCallback,
    isValid
  };
}

export default useImportScriptModal;
