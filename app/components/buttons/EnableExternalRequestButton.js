import { settings } from "connectors";
import KeyBlueButton from "./KeyBlueButton";

const EnableExternalRequestButton = ({ children, requestType,
  onAddAllowedRequestType, onClick }) => {

  const onClickFunction = () => onClick ? onClick() && onAddAllowedRequestType(requestType) : onAddAllowedRequestType(requestType);

  return <KeyBlueButton onClick={onClickFunction}>{children}</KeyBlueButton>;
};

export default settings(EnableExternalRequestButton);
