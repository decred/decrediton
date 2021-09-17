import { KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import style from "./shared.module.css";

const ButtonsToolbar = ({
  onSubmit,
  onCancelModal,
  submitLabel,
  isValid,
  className,
  loading
}) => (
  <div className={className}>
    <InvisibleButton
      className={style.passphraseCloseButton}
      onClick={onCancelModal}>
      <T id="passphraseModal.btnCancel" m="Cancel" />
    </InvisibleButton>
    <KeyBlueButton
      loading={loading}
      disabled={
        // if isValid is not passed as props, we never validate it.
        (isValid === undefined ? false : !isValid) || loading
      }
      onClick={onSubmit}>
      {submitLabel ? (
        submitLabel
      ) : (
        <T id="passphraseModal.continue" m="Continue" />
      )}
    </KeyBlueButton>
  </div>
);

export default ButtonsToolbar;
