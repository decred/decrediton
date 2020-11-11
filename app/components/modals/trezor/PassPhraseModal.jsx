import { PassphraseModal } from "modals";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import styles from "./trezor.module.css";

const TrezorPassphraseModal = ({
  isGetStarted,
  device,
  deviceLabel,
  onSubmitPassPhrase,
  onCancelModal
}) => {
  const onSubmit = (passPhrase) => {
    onSubmitPassPhrase(passPhrase);
  };

  const trezorLabel = device ? deviceLabel : "";

  const className = classNames(
    styles.trezorPassphraseModal,
    isGetStarted && getStarted
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
