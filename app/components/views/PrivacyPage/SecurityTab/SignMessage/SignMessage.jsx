import { withRouter } from "react-router-dom";
import { useSignMessage } from "./hooks";
import SignMessageForm from "./SignMessageForm";
import Signature from "./Signature";
import { useMountEffect } from "hooks";

const SignMessage = ({ location }) => {
  const {
    intl,
    walletService,
    signMessageSignature,
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
    onSignMessageAttempt,
    onSignMessageAttemptTrezor,
    onSignMessageCleanStore,
    onValidateAddress
  } = useSignMessage();

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

export default withRouter(SignMessage);
