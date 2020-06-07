import { useState, useCallback } from "react";

const initialState = {
  name: "",
  hasFailedAttempt: false
};

function useAddAccountModal(onCancelModal, onSubmit) {
  const [state, setState] = useState(initialState);

  const onCancelModalCallback = useCallback(() => {
    setState(initialState);
    onCancelModal && onCancelModal();
  }, [onCancelModal]);

  const validationFailed = useCallback(() => {
    setState({ ...state, hasFailedAttempt: true });
  }, [state]);

  const setName = useCallback((name) => {
    if (name == "") setState({ ...state, hasFailedAttempt: true });
    setState({ ...state, name });
  }, [state]);

  const onSubmitCallback = useCallback((passPhrase) => {
    const { name } = state;
    onSubmit(passPhrase, name);
    setState(initialState);
  }, [state, onSubmit]);

  const isValid = useCallback(() => {
    const { name } = state;
    return !!name;
  }, [state]);

  return {
    state,
    onCancelModalCallback,
    validationFailed,
    setName,
    onSubmitCallback,
    isValid
  };
}

export default useAddAccountModal;
