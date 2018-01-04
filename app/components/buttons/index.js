export { default as EyeFilterMenu } from "./EyeFilterMenu";
export { default as HelpLink } from "./HelpLink";
export { default as SlateGrayButton } from "./SlateGrayButton";
export { default as RescanButton } from "./RescanButton";
export { default as RescanCancelButton } from "./RescanCancelButton";
export { default as TextToggle } from "./TextToggle";
export { default as TicketsCogs } from "./TicketsCogs";
export { default as TransactionLink } from "./TransactionLink";

import ModalButton from "./ModalButton";
import KeyBlueButton from "./KeyBlueButton";
import AutoBuyerSwitch from "./AutoBuyerSwitch";
export { ModalButton, AutoBuyerSwitch, KeyBlueButton };

/***************************************************
 * Custom Modal Buttons
 ***************************************************/
import { InfoModal, PassphraseModal, ChangePassphraseModalContent } from "modals";

// mbb = ModalButtonBuilder (func to build a functional ModalButton component
// with extra fixed props)
const mbb = (className, modalComponent, buttonComponent) => p =>
  <ModalButton
    {...{
      ...p,
      buttonComponent,
      modalComponent: p.modalComponent || modalComponent,
      className: [className||"",p.className||""].join(" "),
    }}
  />;

export const HelpLinkInfoModal = mbb("help-icon", InfoModal);
export const InfoModalButton = mbb("purchase-tickets-info-button", InfoModal);
export const ChangePassphraseButton = mbb("change-password-default-icon", ChangePassphraseModalContent);
export const PassphraseModalButton = mbb(null, PassphraseModal, KeyBlueButton);
export const PassphraseModalSwitch = mbb(null, PassphraseModal, AutoBuyerSwitch);
