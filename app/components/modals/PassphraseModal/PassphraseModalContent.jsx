import DefaultModal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import styles from "../Modals.module.css";
import { classNames } from "pi-ui";
import { PasswordInput, PassphraseModalField } from "inputs";
import { ButtonsToolbar } from "shared";

const Modal = ({
  modalClassName,
  show,
  modalDescription,
  modalTitle,
  children,
  onCancelModal,
  passPhrase,
  onSubmit,
  setPassPhrase,
  submitLabel,
  isValid
}) => (
  <DefaultModal
    className={classNames(styles.passphrase, modalClassName)}
    {...{ show, onCancelModal }}>
    <div className={styles.passphraseHeader}>
      <div className={styles.passphraseHeaderTitle}>
        {modalTitle ? (
          modalTitle
        ) : (
          <T
            id="passphraseModal.confirmationRequired"
            m="Confirmation Required"
          />
        )}
      </div>
      <div className={styles.passphraseHeaderDescription}>
        {modalDescription}
      </div>
    </div>
    <div className={styles.passphraseContent}>
      <PassphraseModalField
        label={
          <T id="passphraseModal.privatePassphrase" m="Private Passphrase" />
        }>
        <PasswordInput
          autoFocus={true}
          required
          id="passphrase"
          placeholder=""
          value={passPhrase}
          onChange={(e) => setPassPhrase(e.target.value)}
          onKeyDownSubmit={onSubmit}
          showErrors={passPhrase !== null && !passPhrase}
        />
      </PassphraseModalField>
      {children}
    </div>
    <div className={styles.passphraseToolbar}>
      <ButtonsToolbar {...{ onCancelModal, onSubmit, isValid, submitLabel }} />
    </div>
  </DefaultModal>
);

export default Modal;
