import { FormattedMessage as T } from "react-intl";
import { InfoConfirmModal } from "modals";
import { classNames } from "pi-ui";
import styles from "./TrezorModals.module.css";

const TrezorTogglePassphraseConfirmModal = ({
  isGetStarted,
  deviceLabel,
  enablePassphraseProtection,
  togglePassphraseConfirmCallback
}) => {
  const enable = enablePassphraseProtection ? "Enable" : "Disable";
  const enabled = enablePassphraseProtection ? "enabled" : "disabled";
  const ifEnabled = enablePassphraseProtection
    ? " For your first sensitive operation, " +
      "the device will ask for a passphrase. This pasphrase deterministically creates a " +
      "new seed for your Trezor. If used with an already created wallet, subsequent " +
      "actions will likely fail, as the device is now using a different account/wallet. " +
      "As long as the device stays plugged in, further actions will reuse the first " +
      "passed passphrase and not ask again."
    : "";

  return (
    <InfoConfirmModal
      show={true}
      modalTitle={
        <T
          id="trezor.togglePassphraseConfirmModal.title"
          m="{enable} Trezor Passphrase"
          values={{
            enable: <span className={styles.label}>{enable}</span>
          }}
        />
      }
      modalClassName={classNames(
        styles.togglePassphraseConfirmModal,
        isGetStarted && styles.getStarted
      )}
      modalDescription={
        <p>
          <T id="trezor.togglePassphraseConfirmModal.description" />
        </p>
      }
      modalContent={
        <p>
          <T
            id="trezor.togglePassphraseConfirmModal.content"
            m={
              "Passphrase protection has been {enabled} for {label}.{ifEnabled} You must " +
              "unplug and plug back in your Trezor in order for these changes to take " +
              "effect on the device."
            }
            values={{
              label: <span className={styles.label}>'{deviceLabel}'</span>,
              enabled: <span className={styles.label}>{enabled}</span>,
              ifEnabled: <span className={styles.label}>{ifEnabled}</span>
            }}
          />
        </p>
      }
      {...{ onCancelModal: togglePassphraseConfirmCallback }}
    />
  );
};

export default TrezorTogglePassphraseConfirmModal;
