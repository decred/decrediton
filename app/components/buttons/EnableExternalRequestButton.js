import { settings } from "connectors";
import KeyBlueButton from "./KeyBlueButton";

const EnableExternalRequestButton = ({ children, requestType,
  onAddAllowedRequestType, onClick }) => {

  const onClickAllowed = () => onAddAllowedRequestType(requestType) && onClick ? onClick() : null;

  return <KeyBlueButton onClick={onClickAllowed}>{children}</KeyBlueButton>;
};

export default settings(EnableExternalRequestButton);
