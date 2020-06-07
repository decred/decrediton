import { useState, useCallback } from "react";

const initialState = {
  privPass: "",
  confirmPrivPass: "",
  confirmPrivPassError: false,
  hasFailedAttempt: false,
  triggerPassphraseModalSubmit: false
};

function useChangePassphraseModal(onCancelModal, onSubmit) {
  const [state, setState] = useState(initialState);

  const onCancelModalCallback = useCallback(() => {
    setState(initialState);
    onCancelModal && onCancelModal();
  }, [onCancelModal]);

  const validationFailed = useCallback(() => {
    const privPassError = !state.privPass;
    const hasFailedAttempt = true;
    const confirmPrivPassError =
      state.privPass !== state.confirmPrivPass;
    setState({ ...state, privPassError, hasFailedAttempt, confirmPrivPassError });
  }, [state]);

  const isValid = useCallback(() => {
    return (
      !!state.privPass &&
      state.privPass === state.confirmPrivPass
    );
  }, [state]);

  const onSubmitCallback = useCallback((passPhrase) => {
    onSubmit(passPhrase, state.privPass, true);
    setState(initialState);
  }, [state, onSubmit]);

  const updatePrivatePassphrase = useCallback((privPass) => {
    if (privPass == "") setState({ ...state, hasFailedAttempt: true });
    setState({ ...state, privPass, triggerPassphraseModalSubmit: false });
  }, [state]);

  const updateConfirmPrivatePassphrase = useCallback((confirmPrivPass) => {
    if (confirmPrivPass == "") setState({ ...state, hasFailedAttempt: true });
    setState({
      ...state,
      confirmPrivPass,
      confirmPrivPassError: false,
      triggerPassphraseModalSubmit: false
    });
  }, [state]);

  const onTriggerPassphraseModalSubmit = useCallback(() => {
    setState({ ...state, triggerPassphraseModalSubmit: true });
  }, [state]);

  return {
    state,
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
