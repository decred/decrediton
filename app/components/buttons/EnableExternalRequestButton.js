import { settings } from "connectors";
import KeyBlueButton from "./KeyBlueButton";

const EnableExternalRequestButton = ({ children, requestType, tempSettings,
  onSaveSettings }) => {

  const onClick = () => {
    const allowedExternalRequests = [ ...tempSettings.allowedExternalRequests ];
    if (allowedExternalRequests.indexOf(requestType) === -1) {
      allowedExternalRequests.push(requestType);
      onSaveSettings({ ...tempSettings, allowedExternalRequests });
    }
  };

  return <KeyBlueButton onClick={onClick}>{children}</KeyBlueButton>;
};

export default settings(EnableExternalRequestButton);
