import { useSettings } from "hooks";
import KeyBlueButton from "./KeyBlueButton/KeyBlueButton";

const EnableExternalRequestButton = ({ children, requestType, onClick }) => {
  const { onAddAllowedRequestType } = useSettings();
  return (
    <KeyBlueButton
      onClick={() =>
        onAddAllowedRequestType(requestType).then(() => onClick && onClick())
      }>
      {children}
    </KeyBlueButton>
  );
};

export default EnableExternalRequestButton;
