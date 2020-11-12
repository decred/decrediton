import { useCallback } from "react";
import { FormattedMessage as T } from "react-intl";
import { PassphraseModal } from "modals";
import { classNames } from "pi-ui";
import styles from "./TrezorModals.module.css";

const TrezorPassphraseModal = ({
  isGetStarted,
  device,
  deviceLabel,
  onSubmitPassPhrase,
  onCancelModal
}) => {
  const onSubmit = useCallback((passPhrase) => {
    onSubmitPassPhrase(passPhrase);
  }, [onSubmitPassPhrase]);

  const trezorLabel = device ? deviceLabel : "";

  const className = classNames(
    styles.trezorPassphraseModal,
    isGetStarted && styles.getStarted
  );

  return (
    <PassphraseModal
      show={true}
      modalTitle={
        <T id="trezor.passphraseModal.title" m="Enter Trezor Passphrase" />
      }
      modalClassName={className}
      modalDescription={
        <p>
          <T
            id="trezor.passphraseModal.description"
            m="Type the secret passphrase for the wallet stored in trezor {label}"
            values={{
              label: <span className={styles.trezorLabel}>'{trezorLabel}'</span>
            }}
          />
        </p>
      }
      {...{ onCancelModal, onSubmit }}
    />
  );
};

export default TrezorPassphraseModal;
