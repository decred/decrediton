import DefaultModal from "../Modal";
import { FormattedMessage as T, defineMessages } from "react-intl";
import styles from "./PassphraseModal.module.css";
import { classNames } from "pi-ui";
import { PasswordInput } from "inputs";
import { ButtonsToolbar } from "shared";

const messages = defineMessages({
  labelText: {
    id: "passphraseModal.privatePassphrase",
    defaultMessage: "Private Passphrase"
  },
  placeholderText: {
    id: "passphraseModal.placeholder",
    defaultMessage: "Write your Private Passphrase {ifRequired}"
  },
  ifRequiredText: {
    id: "passphraseModal.ifRequired",
    defaultMessage: " (if required)"
  }
});

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
  isValid,
  passphraseLabel,
  passphraseNotRequired,
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
            id="passphraseModal.confirmationRequired"
            m="Confirmation Required"
          />
        )}
      </div>
      <div className={styles.headerDescription}>{modalDescription}</div>
    </div>
    <div className={styles.content}>
      <PasswordInput
        newBiggerFontStyle
        autoFocus={true}
        required={!passphraseNotRequired}
        id="passphrase"
        label={
          passphraseLabel
            ? passphraseLabel
            : intl.formatMessage(messages.labelText)
        }
        placeholder={intl.formatMessage(messages.placeholderText, {
          ifRequired: passphraseNotRequired
            ? intl.formatMessage(messages.ifRequiredText)
            : ""
        })}
        value={passPhrase}
        onChange={(e) => setPassPhrase(e.target.value)}
        onKeyDownSubmit={onSubmit}
        showErrors={
          passPhrase !== null && !passPhrase && !passphraseNotRequired
        }
      />
      {children}
    </div>
    <div className={styles.toolbar}>
      <ButtonsToolbar {...{ onCancelModal, onSubmit, isValid, submitLabel }} />
    </div>
  </DefaultModal>
);
export default Modal;
