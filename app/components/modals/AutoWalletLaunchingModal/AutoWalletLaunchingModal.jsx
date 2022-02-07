import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import styles from "./AutoWalletLaunchingModal.module.css";
import { PiUiButton, InvisiblePiUiButton } from "buttons";
import { useState } from "react";
import { Checkbox } from "pi-ui";

const AutoWalletLaunchingModal = ({ onCancelModal, onSubmit, show }) => {
  const [autoOpenWallet, setAutoOpeningWallet] = useState(true);
  return (
    <Modal className={styles.modal} {...{ show, onCancelModal }}>
      <div className={styles.title}>
        <T id="autoWalletLaunching.title" m="Automatic Wallet Launching" />
      </div>
      <Checkbox
        label={
          <T
            id="autoWalletLaunching.checkboxLabel"
            m="Launch wallet immediately after loading completes"
          />
        }
        id="autostart"
        description={
          <T
            id="autoWalletLaunching.checkboxDesc"
            m="You’ll be able to change this later in Settings."
          />
        }
        checked={autoOpenWallet}
        onChange={() => setAutoOpeningWallet(!autoOpenWallet)}
      />
      <div
        className={styles.infoCloseButtonTop}
        onClick={() => onCancelModal()}
      />
      <div className={styles.buttons}>
        <InvisiblePiUiButton onClick={() => onCancelModal()}>
          <T id="autoWalletLaunching.askMeLater" m="Ask me later" />
        </InvisiblePiUiButton>
        <PiUiButton onClick={() => onSubmit(autoOpenWallet)}>
          <T id="autoWalletLaunching.save" m="Save" />
        </PiUiButton>
      </div>
    </Modal>
  );
};

export default AutoWalletLaunchingModal;
