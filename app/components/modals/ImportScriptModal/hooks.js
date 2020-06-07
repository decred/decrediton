import { useState, useCallback } from "react";

const initialState = {
  script: "",
  hasFailedAttempt: false
};

function useImportScriptModal(onCancelModal, onSubmit) {
  const [state, setState] = useState(initialState);

  const onCancelModalCallback = useCallback(() => {
    setState(initialState);
    onCancelModal && onCancelModal();
  }, [onCancelModal]);

  const validationFailed = useCallback(() => {
    setState({ ...state, hasFailedAttempt: true });
  }, [state]);

  const setScript = useCallback((script) => {
    if (script == "") setState({ ...state, hasFailedAttempt: true });
    setState({ ...state, script });
  }, [state]);

  const onSubmitCallback = useCallback((passPhrase) => {
    const { script } = state;
    onSubmit(passPhrase, script);
    setState({ ...state, initialState });
  }, [state, onSubmit]);

  const isValid = useCallback(() => {
    const { script } = state;
    return !!script;
  }, [state]);

  return {
    state,
    onCancelModalCallback,
    validationFailed,
    setScript,
    onSubmitCallback,
    isValid
  };
}

export default useImportScriptModal;
