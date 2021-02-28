import { MixerSettingsModal } from "modals";
import ModalButton from "../ModalButton";
import InvisibleButton from "../InvisibleButton/InvisibleButton";
import { classNames } from "pi-ui";
import style from "./MixerSettingsIconButton.module.css";

const MixerSettingsIconButton = ({ className }) => (
  <ModalButton
    buttonComponent={InvisibleButton}
    className={classNames(style.button, className)}
    modalComponent={MixerSettingsModal}
  />
);

export default MixerSettingsIconButton;
