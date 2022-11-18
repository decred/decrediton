import { classNames, Icon } from "pi-ui";
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
export { default as MixerSettingsIconButton } from "./MixerSettingsIconButton";
export { default as ListUTXOsButton } from "./ListUTXOsButton";
export { default as PiUiButton } from "./PiUiButton";
export { default as InvisiblePiUiButton } from "./InvisiblePiUiButton";
export { default as SearchForNodesButton } from "./SearchForNodesButton";
export { default as DocButton } from "./DocButton";

import ModalButton from "./ModalButton";
import KeyBlueButton from "./KeyBlueButton";
import ToggleSwitch from "./ToggleSwitch/ToggleSwitch";
import AutoBuyerSwitch from "./AutoBuyerSwitch";
import DangerButton from "./DangerButton";
import CloseButton from "./CloseButton";
import HelpLink from "./HelpLink/HelpLink";
import InvisibleButton from "./InvisibleButton";
import Button from "./Button/Button";
import PiUiButton from "./PiUiButton";
import CopyToClipboardButton from "./CopyToClipboardButton";
export {
  ModalButton,
  ToggleSwitch,
  AutoBuyerSwitch,
  KeyBlueButton,
  DangerButton,
  CloseButton,
  InvisibleButton,
  Button,
  CopyToClipboardButton
};

/***************************************************
 * Custom Modal Buttons
 ***************************************************/
import {
  InfoModal,
  QRModal,
  PassphraseModal,
  ChangePassphraseModal,
  ConfirmModal,
  DocumentationInfoModal,
  AboutModal,
  CantCloseModals,
  SetNewPassphraseModal,
  AppPassAndPassphraseModal,
  DiscoverUsageModal
} from "modals";

import styles from "./Buttons.module.css";

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

const InfoButton = ({ className, onClick }) => (
  <span onClick={onClick} className={className}>
    <Icon type="info" width={18} height={18} />
  </span>
);

export const HelpLinkInfoModal = mbb(
  null,
  DocumentationInfoModal,
  helpLinkButtonNew
);
export const HelpLinkAboutModal = mbb(null, AboutModal, helpLinkButtonNew);
export const InfoModalButton = mbb(styles.infoModalButton, InfoModal);
export const InfoDocModalButton = mbb(
  styles.infoModalButton,
  DocumentationInfoModal
);
export const PiUiInfoDocModalButton = mbb(
  styles.button,
  DocumentationInfoModal,
  InfoButton
);
export const InfoDocFieldModalButton = mbb(
  styles.infoFieldModalButton,
  DocumentationInfoModal
);
export const InfoDocFieldModalInvisibleButton = mbb(
  null,
  DocumentationInfoModal,
  InvisibleButton
);
export const DiscoverUsageButton = mbb(null, DiscoverUsageModal);
export const ChangePassphraseButton = mbb(
  null,
  ChangePassphraseModal,
  PiUiButton
);
export const InvisiblePassphraseModalButton = mbb(
  null,
  PassphraseModal,
  InvisibleButton
);
export const PassphraseModalButton = mbb(null, PassphraseModal, KeyBlueButton);
export const PiUiPassphraseModalButton = mbb(null, PassphraseModal, PiUiButton);
export const SetNewPassphraseModalButton = mbb(
  null,
  SetNewPassphraseModal,
  KeyBlueButton
);
export const AppPassAndPassphraseModalButton = mbb(
  null,
  AppPassAndPassphraseModal,
  KeyBlueButton
);

export const TicketPurchaseModalButton = mbb(null, PassphraseModal, PiUiButton);

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
  null,
  CantCloseModals,
  InvisibleButton
);
export const CloseChannelModalButton = mbb(null, ConfirmModal, PiUiButton);
export const QRModalButton = mbb(null, QRModal, InvisibleButton);
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
