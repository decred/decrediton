import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as trza from "actions/TrezorActions";

export function useSignMessage() {
  const dispatch = useDispatch();
  const signMessageError = useSelector(sel.signMessageError);
  const signMessageSignature = useSelector(sel.signMessageSignature);
  const walletService = useSelector(sel.walletService);
  const isSigningMessage = useSelector(sel.isSigningMessage);
  const isSignMessageDisabled = useSelector(sel.isSignMessageDisabled);
  const isTrezor = useSelector(sel.isTrezor);

  const onSignMessageCleanStore = useCallback(
    () => dispatch(ca.signMessageCleanStore),
    [dispatch]
  );
  const onSignMessageAttempt = useCallback(
    (address, message, passphrase) =>
      dispatch(ca.signMessageAttempt(address, message, passphrase)),
    [dispatch]
  );
  const onSignMessageAttemptTrezor = useCallback(
    (address, message) =>
      dispatch(trza.signMessageAttemptTrezor(address, message)),
    [dispatch]
  );

  return {
    signMessageError,
    signMessageSignature,
    walletService,
    isSigningMessage,
    isSignMessageDisabled,
    isTrezor,
    onSignMessageCleanStore,
    onSignMessageAttempt,
    onSignMessageAttemptTrezor
  };
}
