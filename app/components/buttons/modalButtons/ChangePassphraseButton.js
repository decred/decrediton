import { ChangePassphraseModalContent } from "modals";
import ModalButton from "./ModalButton";
import "style/MiscComponents.less";

export default props => (
  <ModalButton
    {...{
      ...props,
      className: "change-password-default-icon",
      modalComponent: ChangePassphraseModalContent
    }}
  />
);
