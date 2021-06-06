import DefaultModal from "../../Modal";
import { FormattedMessage as T } from "react-intl";
import styles from "./SetNewPassModalContent.module.css";
import { classNames } from "pi-ui";
import { PasswordInput, PassphraseModalField } from "inputs";
import { ButtonsToolbar } from "shared";

const Modal = ({
  modalClassName,
  show,
  modalDescription,
  modalTitle,
  onCancelModal,
  passphrase,
  onSubmit,
  setPassphrase,
  submitLabel,
  confirmPrivPass,
  onTriggerPassphraseModalSubmit,
  isValid,
  setConfirmPrivPass
}) => (
  <DefaultModal
    className={classNames(styles.passphrase, modalClassName)}
    {...{ show, onCancelModal }}>
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        {modalTitle ? (
          modalTitle
        ) : (
          <T
            id="setNewPassphraseModal.confirmationRequired"
            m="Confirmation Required"
          />
        )}
      </div>
      <div className={styles.geaderDescription}>{modalDescription}</div>
    </div>
    <div className={styles.content}>
      <PassphraseModalField
        label={
          <T id="setNewPassphraseModal.privatePassphrase" m="New Passphrase" />
        }>
        <PasswordInput
          autoFocus={true}
          required
          id="passphrase"
          placeholder=""
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          onKeyDownSubmit={onSubmit}
          showErrors={passphrase !== null && !passphrase}
        />
      </PassphraseModalField>
      <PassphraseModalField
        label={<T id="setNewPassModal.confirm" m="Confirm" />}>
        <PasswordInput
          id="confirmPrivPassInput"
          required
          showErrors={confirmPrivPass !== null && !isValid}
          placeholder=""
          value={confirmPrivPass}
          onChange={(e) => setConfirmPrivPass(e.target.value)}
          onKeyDownSubmit={onTriggerPassphraseModalSubmit}
        />
      </PassphraseModalField>
    </div>
    <div className={styles.toolbar}>
      <ButtonsToolbar {...{ onCancelModal, onSubmit, isValid, submitLabel }} />
    </div>
  </DefaultModal>
);

export default Modal;
