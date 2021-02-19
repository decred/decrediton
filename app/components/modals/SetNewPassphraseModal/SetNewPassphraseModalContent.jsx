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
  onCancelModal,
  passPhrase,
  onSubmit,
  setPassPhrase,
  submitLabel,
  confirmPrivPass,
  onTriggerPassphraseModalSubmit,
  isValid,
  setConfirmPrivPass
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
            id="setNewPassphraseModal.confirmationRequired"
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
        label={
          <T id="setNewPassphraseModal.privatePassphrase" m="New Passphrase" />
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
      <PassphraseModalField
        label={<T id="setNewPassModal.confirm" m="Confirm" />}>
        <PasswordInput
          required
          showErrors={confirmPrivPass !== null && !isValid}
          placeholder=""
          value={confirmPrivPass}
          onChange={(e) => setConfirmPrivPass(e.target.value)}
          onKeyDownSubmit={onTriggerPassphraseModalSubmit}
        />
      </PassphraseModalField>
    </div>
    <div className={style.passphraseToolbar}>
      <ButtonsToolbar {...{ onCancelModal, onSubmit, isValid, submitLabel }} />
    </div>
  </DefaultModal>
);

export default Modal;
