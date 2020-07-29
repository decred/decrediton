import { FormattedMessage as T } from "react-intl";
import DefaultModal from "../Modal";
import { TextInput } from "inputs";
import { KeyBlueButton, InvisibleButton } from "buttons";
import style from "../Modals.module.css";
import { classNames } from "pi-ui";

const Modal = ({
  script,
  hasFailedAttempt,
  setScript,
  isValid,
  onSubmit,
  onCancelModal,
  show
}) => (
  <DefaultModal className={style.importRedeemScript} {...{ show, onCancelModal }}>
    <div className={style.passphraseHeader}>
      <div className={style.passphraseHeaderTitle}>
        <T
          id="passphraseModal.confirmationRequired"
          m="Confirmation Required"
        />
      </div>
    </div>
    <TextInput
      autoFocus
      required
      showErrors={hasFailedAttempt}
      id="script"
      type="text"
      placeholder=""
      value={script}
      onChange={(e) => setScript(e.target.value)}
    />
    <div className={style.importRedeemScriptToolbar}>
      <KeyBlueButton disabled={!isValid} onClick={onSubmit}>
        <T id="passphraseModal.continue" m="Continue" />
      </KeyBlueButton>
      <InvisibleButton
        className={style.passphraseCloseButton}
        onClick={onCancelModal}>
        <T id="passphraseModal.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </DefaultModal>
);

export default Modal;
