export { default as EyeFilterMenu } from "./EyeFilterMenu";
export { default as EyeFilterMenuWithSlider } from "./EyeFilterMenuWithSlider";
export { default as HelpLink } from "./HelpLink";
export { default as SlateGrayButton } from "./SlateGrayButton";
export { default as PathButton } from "./PathButton";
export { default as RescanButton } from "./RescanButton";
export { default as RescanCancelButton } from "./RescanCancelButton";
export { default as TextToggle } from "./TextToggle";
export { default as TicketsCogs } from "./TicketsCogs";
export { default as TransactionLink } from "./TransactionLink";
export { default as VerticalExpand } from "./VerticalExpand";
export { default as EnableExternalRequestButton } from "./EnableExternalRequestButton";
export { default as SendTransactionButton } from "./SendTransactionButton";
export { default as SignMessageButton } from "./SignMessageButton";
export { default as GoBackIconButton } from "./GoBackIconButton";
export { default as ImportScriptIconButton } from "./ImportScriptIconButton";
export { default as TrezorWalletSwitch } from "./TrezorWalletSwitch";

import ModalButton from "./ModalButton";
import KeyBlueButton from "./KeyBlueButton";
import AutoBuyerSwitch from "./AutoBuyerSwitch";
import WatchOnlyWalletSwitch from "./WatchOnlyWalletSwitch";
import NetworkSwitch from "./NetworkSwitch";
import DangerButton from "./DangerButton";
import CloseButton from "./CloseButton";
import HelpLink from "./HelpLink";
import InvisibleButton from "./InvisibleButton";
export { ModalButton, AutoBuyerSwitch, KeyBlueButton, DangerButton,
  CloseButton, NetworkSwitch, InvisibleButton, WatchOnlyWalletSwitch };

/***************************************************
 * Custom Modal Buttons
 ***************************************************/
import {
  InfoModal, PassphraseModal, ChangePassphraseModal,
  ConfirmModal, InfoDocumentModal, AboutModal
} from "modals";

// mbb = ModalButtonBuilder (func to build a functional ModalButton component
// with extra fixed props)
const mbb = (className, modalComponent, buttonComponent) => p =>
  <ModalButton
    {...{
      ...p,
      buttonComponent,
      modalComponent: p.modalComponent || modalComponent,
      className: [ className || "", p.className || "" ].join(" "),
    }}
  />;

const helpLinkButtonNew = ({ className, onClick, title, subtitle }) =>
  <HelpLink className={className} onClick={onClick} title={title} subtitle={subtitle} expand/>;

const helpLinkButton = ({ className, onClick, buttonLabel }) =>
  <div className={className} onClick={onClick}>{buttonLabel}</div>;

export const HelpLinkInfoModal = mbb(null, InfoModal, helpLinkButtonNew);
export const HelpLinkAboutModal = mbb(null, AboutModal, helpLinkButtonNew);
export const InfoModalButton = mbb("info-modal-button", InfoModal);
export const InfoDocModalButton = mbb("info-modal-button", InfoDocumentModal);
export const InfoDocFieldModalButton = mbb("info-field-modal-button", InfoDocumentModal);
export const ChangePassphraseButton = mbb("change-password-default-icon", ChangePassphraseModal);
export const InvisiblePassphraseModalButton = mbb(null, PassphraseModal, InvisibleButton);
export const PassphraseModalButton = mbb(null, PassphraseModal, KeyBlueButton);
export const PassphraseModalSwitch = mbb(null, PassphraseModal, AutoBuyerSwitch);
export const RemoveStakePoolButton = mbb(null, ConfirmModal, DangerButton);
export const RemoveWalletButton = mbb(null, ConfirmModal, DangerButton);
export const RemoveDaemonButton = mbb(null, ConfirmModal, DangerButton);
export const ResetNetworkButton = mbb(null, ConfirmModal, KeyBlueButton);
export const ScriptRedeemableButton = mbb(null, InfoModal, helpLinkButton);
export const AboutModalButton = mbb(null, AboutModal, KeyBlueButton);
export const AboutModalButtonInvisible = mbb(null, AboutModal, InvisibleButton);
export const CloseWalletModalButton = mbb("close-modal-button", ConfirmModal, InvisibleButton);
