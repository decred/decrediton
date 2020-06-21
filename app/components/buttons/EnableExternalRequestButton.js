import { settings } from "connectors"; // use useSettings hook
import KeyBlueButton from "./KeyBlueButton";

const EnableExternalRequestButton = ({
  children,
  requestType,
  onAddAllowedRequestType,
  onClick
}) => (
  <KeyBlueButton
    onClick={() =>
      onAddAllowedRequestType(requestType).then(() => onClick && onClick())
    }>
    {children}
  </KeyBlueButton>
);

export default settings(EnableExternalRequestButton);
