import { InfoModal } from "modals";
import ModalButton from "./ModalButton";
import "style/MiscComponents.less";

export default props => (
  <ModalButton
    {...{
      ...props,
      className: ["purchase-tickets-info-button", props.className||""].join(" "),
      modalComponent: props.modalComponent || InfoModal
    }}
  />
);
