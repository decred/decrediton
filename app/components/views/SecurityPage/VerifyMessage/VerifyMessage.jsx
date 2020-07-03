import { useEffect, useState } from "react";
import { FormattedMessage as T, injectIntl } from "react-intl";
import VerifyMessageForm from "./VerifyMessageForm";
import { useVerifyMessage } from "./hooks";
import { useValidateAddress } from "../ValidateAddress/hooks";

const VerifyMessage = ({ intl }) => {
  const {
    verifyMessageSuccess,
    isVerifyingMessage,
    onVerifyMessageAttempt,
    onVerifyMessageCleanStore,
    onGetMessageVerificationServiceAttempt
  } = useVerifyMessage();
  const { onValidateAddress } = useValidateAddress();
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(null);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(null);
  const [signature, setSignature] = useState("");
  const [signatureError, setSignatureError] = useState(null);
  
  useEffect(() => {
    onGetMessageVerificationServiceAttempt();
    return () => onVerifyMessageCleanStore();
  }, []);

  const onChangeAddress = async (address) => {
    setAddress(address);
    if (address === "") {
      return;
    }
    try {
      const resp = await onValidateAddress(address);
      setAddressError(!resp.getIsValid() ? "Please enter a valid address" : null);
    } catch (e) {
      setAddressError("Error: Address validation failed, please try again");
    }
  }

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
  }

  const onSubmit = () => {
    if (addressError || messageError || signatureError) return;
    onVerifyMessageAttempt(address, message, signature);
  }

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
}

export default injectIntl(VerifyMessage);