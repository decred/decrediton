import { useEffect, useState } from "react";
import { FormattedMessage as T, injectIntl } from "react-intl";
import VerifyMessageForm from "./Form";
import { verifyMessagePage } from "connectors";
import { useVerifyMessage } from "./hooks";
import { useValidateAddress } from "../ValidateAddress/hooks";
import "style/SecurityCenterMessagePage.less";


const VerifyMessage = () => {
  const { 
    onVerifyMessageCleanStore,
    onGetMessageVerificationServiceAttempt
  } = useVerifyMessage();
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [addressError, setAddressError] = useState(null);
  const [messageError, setMessageError] = useState(null);

  useEffect(() => {
    onGetMessageVerificationServiceAttempt()
    return () => onVerifyMessageCleanStore();
  });
  
}


export default VerifyMessage;
