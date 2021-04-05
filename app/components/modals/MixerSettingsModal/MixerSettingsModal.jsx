import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import styles from "./MixerSettingsModal.module.css";
import { PrivacyForm } from "shared";

const MixerSettingsModal = ({ onCancelModal, show }) => (
  <Modal className={styles.mixerSettings} {...{ show, onCancelModal }}>
    <div className={styles.title}>
      <T id="mixerSetting.header" m="Mixer Settings" />
    </div>
    <div className={styles.closeButtonTop} onClick={onCancelModal} />
    <PrivacyForm />
    <div>
      <KeyBlueButton className={styles.closeButton} onClick={onCancelModal}>
        <T id="mixerSettings.gotIt" m="Got it" />
      </KeyBlueButton>
    </div>
  </Modal>
);

export default MixerSettingsModal;
