import { KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import style from "../Modals.module.css";

const PassphraseModalButtonsToolbar = ({
  onSubmit,
  onCancelModal,
  submitLabel,
  isValid
}) => (
  <div className={style.passphraseModalToolbar}>
    <KeyBlueButton disabled={!isValid} onClick={onSubmit}>
      {submitLabel ? (
        submitLabel
      ) : (
        <T id="passphraseModal.continue" m="Continue" />
      )}
    </KeyBlueButton>
    <InvisibleButton
      className={style.passphraseModalCloseButton}
      onClick={onCancelModal}>
      <T id="passphraseModal.btnCancel" m="Cancel" />
    </InvisibleButton>
  </div>
);

export default PassphraseModalButtonsToolbar;
