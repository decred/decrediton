export { default as EyeFilterMenu } from "./EyeFilterMenu";
export { default as HelpLink } from "./HelpLink";
export { default as SlateGrayButton } from "./SlateGrayButton";
export { default as InvisibleButton } from "./InvisibleButton";
export { default as PathButton } from "./PathButton";
export { default as RescanButton } from "./RescanButton";
export { default as RescanCancelButton } from "./RescanCancelButton";
export { default as TextToggle } from "./TextToggle";
export { default as TicketsCogs } from "./TicketsCogs";
export { default as TransactionLink } from "./TransactionLink";

import ModalButton from "./ModalButton";
import KeyBlueButton from "./KeyBlueButton";
import AutoBuyerSwitch from "./AutoBuyerSwitch";
import NetworkSwitch from "./NetworkSwitch";
import DangerButton from "./DangerButton";
export { ModalButton, AutoBuyerSwitch, KeyBlueButton, DangerButton, NetworkSwitch };

/***************************************************
 * Custom Modal Buttons
 ***************************************************/
import {
  InfoModal, PassphraseModal, ChangePassphraseModal,
  ConfirmModal
} from "modals";

// mbb = ModalButtonBuilder (func to build a functional ModalButton component
// with extra fixed props)
const mbb = (className, modalComponent, buttonComponent) => p =>
  <ModalButton
    {...{
      ...p,
      buttonComponent,
      modalComponent: p.modalComponent || modalComponent,
      className: [className || "", p.className || ""].join(" "),
    }}
  />;

const helpLinkButton = ({ className, onClick, buttonLabel }) =>
  <div className={className} onClick={onClick}>{buttonLabel}</div>;

export const HelpLinkInfoModal = mbb("help-icon", InfoModal, helpLinkButton);
export const InfoModalButton = mbb("info-modal-button", InfoModal);
export const ChangePassphraseButton = mbb("change-password-default-icon", ChangePassphraseModal);
export const PassphraseModalButton = mbb(null, PassphraseModal, KeyBlueButton);
export const PassphraseModalSwitch = mbb(null, PassphraseModal, AutoBuyerSwitch);
export const RemoveStakePoolButton = mbb(null, ConfirmModal, DangerButton);
export const RemoveWalletButton = mbb(null, ConfirmModal, DangerButton);
