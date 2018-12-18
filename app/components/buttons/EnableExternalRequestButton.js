import { settings } from "connectors";
import KeyBlueButton from "./KeyBlueButton";

const EnableExternalRequestButton = ({ children, requestType,
  onAddAllowedRequestType }) => {

  const onClick = () => onAddAllowedRequestType(requestType);

  return <KeyBlueButton onClick={onClick}>{children}</KeyBlueButton>;
};

export default settings(EnableExternalRequestButton);
