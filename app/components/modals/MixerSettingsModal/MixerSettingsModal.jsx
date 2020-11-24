import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import style from "../Modals.module.css";
import { classNames } from "pi-ui";
import { PrivacyForm } from "shared";

const MixerSettingsModal = ({ onCancelModal, show }) => (
  <Modal
    className={classNames(style.mixerSettings, style.info)}
    {...{ show, onCancelModal }}>
    <div className={style.mixerSettingsTitle}>
      <T id="mixerSetting.header" m="Mixer Settings" />
    </div>
    <div className={style.infoCloseButtonTop} onClick={onCancelModal} />
    <PrivacyForm />
    <div>
      <KeyBlueButton className={style.infoCloseButton} onClick={onCancelModal}>
        <T id="mixerSettings.gotIt" m="Got it" />
      </KeyBlueButton>
    </div>
  </Modal>
);



export default MixerSettingsModal;
