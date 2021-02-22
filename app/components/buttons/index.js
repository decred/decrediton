import { classNames } from "pi-ui";
export { default as EyeFilterMenu } from "./EyeFilterMenu/EyeFilterMenu";
export { default as EyeFilterMenuWithSlider } from "./EyeFilterMenu/EyeFilterMenuWithSlider/EyeFilterMenuWithSlider";
export { default as HelpLink } from "./HelpLink/HelpLink";
export { default as SlateGrayButton } from "./SlateGrayButton";
export { default as PathButton } from "./PathButton/PathButton";
export { default as RescanButton } from "./RescanButton/RescanButton";
export { default as RescanCancelButton } from "./RescanButton/RescanCancelButton";
export { default as TextToggle } from "./TextToggle";
export { default as TicketsCogs } from "./TicketsCogs";
export { default as EnableExternalRequestButton } from "./EnableExternalRequestButton";
export { default as SendTransactionButton } from "./SendTransactionButton";
export { default as ImportScriptIconButton } from "./ImportScriptIconButton";
export { default as MixerSettingsIconButton } from "./MixerSettingsIconButton/MixerSettingsIconButton";

import ModalButton from "./ModalButton";
import KeyBlueButton from "./KeyBlueButton";
import ToggleSwitch from "./ToggleSwitch/ToggleSwitch";
import AutoBuyerSwitch from "./AutoBuyerSwitch";
import DangerButton from "./DangerButton";
import CloseButton from "./CloseButton";
import HelpLink from "./HelpLink/HelpLink";
import InvisibleButton from "./InvisibleButton";
export {
  ModalButton,
  ToggleSwitch,
  AutoBuyerSwitch,
  KeyBlueButton,
  DangerButton,
  CloseButton,
  InvisibleButton
};

/***************************************************
 * Custom Modal Buttons
 ***************************************************/
import {
  InfoModal,
  PassphraseModal,
  ChangePassphraseModal,
  ConfirmModal,
  DocumentationInfoModal,
  AboutModal,
  CantCloseModals
} from "modals";

// mbb = ModalButtonBuilder (func to build a functional ModalButton component
// with extra fixed props)
const mbb = (className, modalComponent, buttonComponent) => (p) => (
  <ModalButton
    {...{
      ...p,
      buttonComponent,
      modalComponent: p.modalComponent || modalComponent,
      className: classNames(className, p.className)
    }}
  />
);

const helpLinkButtonNew = ({ icon, onClick, title, subtitle }) => (
  <HelpLink
    icon={icon}
    onClick={onClick}
    title={title}
    subtitle={subtitle}
    expand
  />
);

const helpLinkButton = ({ className, onClick, buttonLabel }) => (
  <div className={className} onClick={onClick}>
    {buttonLabel}
  </div>
);

const PoliteiaLinkButton = ({ children, onClick }) => (
  <span onClick={onClick}>{children}</span>
);

export const HelpLinkInfoModal = mbb(
  null,
  DocumentationInfoModal,
  helpLinkButtonNew
);
export const HelpLinkAboutModal = mbb(null, AboutModal, helpLinkButtonNew);
export const InfoModalButton = mbb("info-modal-button", InfoModal);
export const InfoDocModalButton = mbb(
  "info-modal-button",
  DocumentationInfoModal
);
export const InfoDocFieldModalButton = mbb(
  "info-field-modal-button",
  DocumentationInfoModal
);
export const ChangePassphraseButton = mbb(
  "change-password-default-icon",
  ChangePassphraseModal
);
export const InvisiblePassphraseModalButton = mbb(
  null,
  PassphraseModal,
  InvisibleButton
);
export const PassphraseModalButton = mbb(null, PassphraseModal, KeyBlueButton);
export const AutoBuyerPassphraseModalSwitch = mbb(
  null,
  PassphraseModal,
  AutoBuyerSwitch
);
export const MixerPassphraseModalSwitch = mbb(
  null,
  PassphraseModal,
  KeyBlueButton
);
export const RemoveStakePoolButton = mbb(null, ConfirmModal, DangerButton);
export const RemoveWalletButton = mbb(null, ConfirmModal, DangerButton);
export const RemoveDaemonButton = mbb(null, ConfirmModal, DangerButton);
export const ResetNetworkButton = mbb(null, ConfirmModal, KeyBlueButton);
export const AddVSPButton = mbb(null, ConfirmModal, KeyBlueButton);
export const ScriptRedeemableButton = mbb(
  null,
  DocumentationInfoModal,
  helpLinkButton
);
export const AboutModalButton = mbb(null, AboutModal, KeyBlueButton);
export const AboutModalButtonInvisible = mbb(null, AboutModal, InvisibleButton);
export const CloseWalletModalButton = mbb(
  "close-modal-button",
  CantCloseModals,
  InvisibleButton
);
export const CloseChannelModalButton = mbb(
  "go-back-icon-button",
  ConfirmModal,
  InvisibleButton
);
export const InvisibleConfirmPoliteiaModalButton = mbb(
  null,
  ConfirmModal,
  PoliteiaLinkButton
);
export const InvisibleConfirmModalButton = mbb(
  null,
  ConfirmModal,
  InvisibleButton
);
