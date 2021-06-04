import { FormattedMessage as T } from "react-intl";
import { PassphraseModal } from "modals";
import { classNames } from "pi-ui";
import styles from "./TrezorModals.module.css";

const TrezorPassphraseModal = ({
  isGetStarted,
  deviceLabel,
  onSubmitPassPhrase,
  onCancelModal
}) => {
  return (
    <PassphraseModal
      show={true}
      passphraseNotRequired={true}
      modalTitle={
        <T id="trezor.passphraseModal.title" m="Enter Trezor Passphrase" />
      }
      modalClassName={classNames(
        styles.passphraseModal,
        isGetStarted && styles.getStarted
      )}
      modalDescription={
        <p>
          <T
            id="trezor.passphraseModal.description"
            m="Type the secret passphrase for the wallet stored in trezor {label}"
            values={{
              label: <span className={styles.label}>'{deviceLabel}'</span>
            }}
          />
        </p>
      }
      {...{ onCancelModal, onSubmit: onSubmitPassPhrase }}
    />
  );
};

export default TrezorPassphraseModal;
