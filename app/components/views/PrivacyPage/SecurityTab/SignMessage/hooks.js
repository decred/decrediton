import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as trza from "actions/TrezorActions";
import { useIntl } from "react-intl";

export function useSignMessage() {
  const intl = useIntl();
  const dispatch = useDispatch();
  const signMessageError = useSelector(sel.signMessageError);
  const signMessageSignature = useSelector(sel.signMessageSignature);
  const walletService = useSelector(sel.walletService);
  const isSigningMessage = useSelector(sel.isSigningMessage);
  const isSignMessageDisabled = useSelector(sel.isSignMessageDisabled);
  const isTrezor = useSelector(sel.isTrezor);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [addressError, setAddressError] = useState(null);
  const [messageError, setMessageError] = useState(null);

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
  const onValidateAddress = async (address) =>
    await dispatch(ca.validateAddress(address));

  return {
    intl,
    signMessageError,
    signMessageSignature,
    walletService,
    isSigningMessage,
    isSignMessageDisabled,
    isTrezor,
    address,
    setAddress,
    message,
    setMessage,
    addressError,
    setAddressError,
    messageError,
    setMessageError,
    onSignMessageCleanStore,
    onSignMessageAttempt,
    onSignMessageAttemptTrezor,
    onValidateAddress
  };
}
