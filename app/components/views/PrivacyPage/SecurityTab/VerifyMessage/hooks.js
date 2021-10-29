import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import { getMessageVerificationServiceAttempt } from "actions/ClientActions";
import { useIntl } from "react-intl";

export function useVerifyMessage() {
  const intl = useIntl();
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(null);
  const [signature, setSignature] = useState("");
  const [signatureError, setSignatureError] = useState(null);

  const dispatch = useDispatch();
  const messageVerificationService = useSelector(
    sel.messageVerificationService
  );
  const verifyMessageError = useSelector(sel.verifyMessageError);
  const verifyMessageSuccess = useSelector(sel.verifyMessageSuccess);
  const isVerifyingMessage = useSelector(sel.isVerifyingMessage);

  const onVerifyMessageAttempt = useCallback(
    (address, message, sig) =>
      dispatch(ca.verifyMessageAttempt(address, message, sig)),
    [dispatch]
  );
  const onVerifyMessageCleanStore = useCallback(
    () => dispatch(ca.verifyMessageCleanStore),
    [dispatch]
  );
  const onGetMessageVerificationServiceAttempt = useCallback(
    () => dispatch(getMessageVerificationServiceAttempt),
    [dispatch]
  );
  const onValidateAddress = async (address) =>
    await dispatch(ca.validateAddress(address));

  return {
    intl,
    address,
    setAddress,
    addressError,
    setAddressError,
    message,
    setMessage,
    messageError,
    setMessageError,
    signature,
    setSignature,
    signatureError,
    setSignatureError,
    messageVerificationService,
    verifyMessageError,
    verifyMessageSuccess,
    isVerifyingMessage,
    onVerifyMessageAttempt,
    onVerifyMessageCleanStore,
    onGetMessageVerificationServiceAttempt,
    onValidateAddress
  };
}
