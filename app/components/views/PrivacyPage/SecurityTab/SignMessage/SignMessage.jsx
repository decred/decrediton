import { useState } from "react";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import { useSignMessage } from "./hooks";
import { useValidateAddress } from "../ValidateAddress/hooks";
import SignMessageForm from "./SignMessageForm";
import Signature from "./Signature";
import { useMountEffect } from "hooks";

const SignMessage = ({ location, intl }) => {
  const {
    walletService,
    signMessageSignature,
    isSigningMessage,
    isSignMessageDisabled,
    isTrezor,
    onSignMessageAttempt,
    onSignMessageAttemptTrezor,
    onSignMessageCleanStore
  } = useSignMessage();
  const { onValidateAddress } = useValidateAddress();
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [addressError, setAddressError] = useState(null);
  const [messageError, setMessageError] = useState(null);

  useMountEffect(() => {
    if (!walletService) {
      location.push("/error");
    }
    return () => onSignMessageCleanStore();
  });

  const onChangeAddress = async (address) => {
    setAddress(address);
    if (address === "") {
      setAddressError("Please enter an address");
      return;
    }
    try {
      const resp = await onValidateAddress(address);
      setAddressError(
        !resp.isValid || !resp.isMine
          ? "Please enter a valid address owned by you"
          : null
      );
    } catch (e) {
      setAddressError("Error: Address validation failed, please try again");
    }
  };

  const onChangeMessage = (msg) => {
    setMessage(msg);
    if (msg === "") {
      setMessageError("Please enter a message");
    } else {
      setMessageError(null);
    }
  };

  const onSubmit = (passphrase) => {
    if (!isTrezor) {
      onSignMessageAttempt(address, message, passphrase);
    } else {
      onSignMessageAttemptTrezor(address, message);
    }
  };

  return (
    <>
      <SignMessageForm
        {...{
          address,
          message,
          addressError,
          messageError,
          formatMessage: intl.formatMessage,
          isTrezor,
          isSigningMessage,
          isSignMessageDisabled,
          signMessageSignature,
          onSubmit,
          onChangeAddress,
          onChangeMessage
        }}
      />
      {signMessageSignature && <Signature signature={signMessageSignature} />}
    </>
  );
};

export default withRouter(injectIntl(SignMessage));
