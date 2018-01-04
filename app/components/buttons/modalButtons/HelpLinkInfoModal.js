import { InfoModal } from "modals";
import ModalButton from "./ModalButton";
import "style/MiscComponents.less";

export default props => (
  <ModalButton
    {...{
      ...props,
      className: ["help-icon", props.className||""].join(" "),
      modalComponent: props.modalComponent || InfoModal
    }}
  />
);
