import DefaultModal from "../../Modal";
import { FormattedMessage as T, defineMessages } from "react-intl";
import styles from "./SetNewPassModalContent.module.css";
import { classNames } from "pi-ui";
import { PasswordInput } from "inputs";
import { ButtonsToolbar } from "shared";

const messages = defineMessages({
  newPassphraseLabelText: {
    id: "setNewPassphraseModal.newPassphrase",
    defaultMessage: "New Passphrase"
  },
  newPassphraseplaceholderText: {
    id: "setNewPassphraseModal.newPassphrasePlaceholder",
    defaultMessage: "Write your New Passphrase"
  },
  confirmPassphraseLabelText: {
    id: "setNewPassphraseModal.confirm",
    defaultMessage: "Confirm"
  },
  confirmPassphraseplaceholderText: {
    id: "setNewPassphraseModal.confirmPassphrasePlaceholder",
    defaultMessage: "Confirm your Passphrase"
  }
});

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
  setConfirmPrivPass,
  intl
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
      <PasswordInput
        newBiggerFontStyle
        autoFocus={true}
        required
        id="passphrase"
        placeholder=""
        value={passphrase}
        onChange={(e) => setPassphrase(e.target.value)}
        onKeyDownSubmit={onSubmit}
        showErrors={passphrase !== null && !passphrase}
        label={intl.formatMessage(messages.newPassphraseLabelText)}
        placeholder={intl.formatMessage(messages.newPassphraseplaceholderText)}
      />
      <PasswordInput
        newBiggerFontStyle
        id="confirmPrivPassInput"
        required
        showErrors={confirmPrivPass !== null && !isValid}
        placeholder=""
        value={confirmPrivPass}
        onChange={(e) => setConfirmPrivPass(e.target.value)}
        onKeyDownSubmit={onTriggerPassphraseModalSubmit}
        label={intl.formatMessage(messages.confirmPassphraseLabelText)}
        placeholder={intl.formatMessage(
          messages.confirmPassphraseplaceholderText
        )}
      />
    </div>
    <div className={styles.toolbar}>
      <ButtonsToolbar {...{ onCancelModal, onSubmit, isValid, submitLabel }} />
    </div>
  </DefaultModal>
);

export default Modal;
