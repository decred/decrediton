import { useEffect } from "react";
import VerifyMessageForm from "./VerifyMessageForm";
import { useVerifyMessage } from "./hooks";
import { useMountEffect } from "hooks";

const VerifyMessage = () => {
  const {
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
    verifyMessageSuccess,
    verifyMessageError,
    isVerifyingMessage,
    onVerifyMessageAttempt,
    onVerifyMessageCleanStore,
    onGetMessageVerificationServiceAttempt,
    onValidateAddress
  } = useVerifyMessage();

  useMountEffect(() => {
    onGetMessageVerificationServiceAttempt();
    return () => onVerifyMessageCleanStore();
  });

  useEffect(() => {
    setSignatureError(null);
    if (
      (verifyMessageSuccess && !verifyMessageSuccess.valid) ||
      verifyMessageError
    ) {
      setSignatureError("Invalid Signature");
    }
  }, [verifyMessageSuccess, verifyMessageError, setSignatureError]);

  const onChangeAddress = async (address) => {
    setAddress(address);
    if (address === "") {
      return;
    }
    try {
      const resp = await onValidateAddress(address);
      setAddressError(!resp.isValid ? "Please enter a valid address" : null);
    } catch (e) {
      setAddressError("Error: Address validation failed, please try again");
    }
  };

  const onChangeMessage = (msg) => {
    setMessage(msg);
    if (msg == "") {
      setMessageError("Please enter a message");
    } else {
      setMessageError(null);
    }
  };

  const onChangeSignature = (signature) => {
    setSignature(signature);
    if (signature == "") {
      setSignatureError("Please enter a signature");
    } else {
      setMessageError(null);
    }
  };

  const onSubmit = () => {
    onVerifyMessageCleanStore();
    onVerifyMessageAttempt(address, message, signature);
  };

  return (
    <>
      <VerifyMessageForm
        {...{
          address,
          message,
          signature,
          addressError,
          messageError,
          signatureError,
          verifyMessageSuccess,
          formatMessage: intl.formatMessage,
          isVerifyingMessage,
          onSubmit,
          onChangeAddress,
          onChangeMessage,
          onChangeSignature
        }}
      />
    </>
  );
};

export default VerifyMessage;
