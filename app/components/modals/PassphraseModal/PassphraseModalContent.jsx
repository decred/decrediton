import DefaultModal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import style from "../Modals.module.css";
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
    className={classNames(style.passphrase, modalClassName)}
    {...{ show, onCancelModal }}>
    <div className={style.passphraseHeader}>
      <div className={style.passphraseHeaderTitle}>
        {modalTitle ? (
          modalTitle
        ) : (
          <T
            id="passphraseModal.confirmationRequired"
            m="Confirmation Required"
          />
        )}
      </div>
      <div className={style.passphraseHeaderDescription}>
        {modalDescription}
      </div>
    </div>
    <div className={style.passphraseContent}>
      <PassphraseModalField
        id="passphrase-input"
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
          ariaLabelledBy="passphrase-input"
          showErrors={passPhrase !== null && !passPhrase}
        />
      </PassphraseModalField>
      {children}
    </div>
    <div className={style.passphraseToolbar}>
      <ButtonsToolbar {...{ onCancelModal, onSubmit, isValid, submitLabel }} />
    </div>
  </DefaultModal>
);

export default Modal;
