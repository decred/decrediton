import { PassphraseModal } from "modals";
import AutoBuyerSwitch from "../AutoBuyerSwitch";
import ModalButton from "./ModalButton";

export default props => (
  <ModalButton
    {...{
      ...props,
      buttonComponent: AutoBuyerSwitch,
      modalComponent: props.modalComponent || PassphraseModal
    }}
  />
);
