import { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import SignMessageForm from "./SignMessageForm";
import { CopyToClipboard } from "shared";
import { useSignMessage } from "./hooks";
import { useValidateAddress } from "../ValidateAddress/hooks";
import styles from "./SignMessage.module.css";

const SignMessage = ({ location, intl }) => {
  const {
    walletService,
    signMessageSignature,
    isSigningMessage,
    isSignMessageDisabled,
    onSignMessageCleanStore,
  } = useSignMessage();
  const { onValidateAddress } = useValidateAddress();
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [addressError, setAddressError] = useState(null);
  const [messageError, setMessageError] = useState(null);

  useEffect(() => {
    if (!walletService) {
      location.push("/error");
    }
    return () => onSignMessageCleanStore();
  });

  const onChangeAddress = async (address) => {
    setAddress(address);
    if (address == "") {
      setAddressError("Please enter an address");
      return
    } 
    try {
      const resp = await onValidateAddress(address);
      setAddressError(!resp.getIsValid() ? "Please enter a valid address" : null);
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

  return (
    <>
      <SignMessageForm
        {...{
          onChangeAddress,
          onChangeMessage,
          address,
          message,
          addressError,
          messageError,
          formatMessage: intl.formatMessage,
          isSigningMessage,
          isSignMessageDisabled
        }}
      />
      {
        signMessageSignature ? (
          <div className={styles.sign}>
            <div className={styles.messageSignature}>{signMessageSignature}</div>
            <CopyToClipboard
              textToCopy={signMessageSignature}
              className={styles.messageContentCopyToClipboardIcon}
            />
          </div>
        ) : null
      }
    </>
  );
};

export default withRouter(injectIntl(SignMessage));