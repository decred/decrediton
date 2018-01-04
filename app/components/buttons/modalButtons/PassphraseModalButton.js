import { PassphraseModal } from "modals";
import KeyBlueButton from "../KeyBlueButton";
import ModalButton from "./ModalButton";

export default props => (
  <ModalButton
    {...{
      ...props,
      buttonComponent: KeyBlueButton,
      modalComponent: props.modalComponent || PassphraseModal
    }}
  />
);
