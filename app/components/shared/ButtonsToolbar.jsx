import { PiUiButton, InvisiblePiUiButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

const ButtonsToolbar = ({
  onSubmit,
  onCancelModal,
  submitLabel,
  isValid,
  className,
  loading
}) => (
  <div className={className}>
    <InvisiblePiUiButton
      onClick={onCancelModal}>
      <T id="passphraseModal.btnCancel" m="Cancel" />
    </InvisiblePiUiButton>
    <PiUiButton
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
    </PiUiButton>
  </div>
);

export default ButtonsToolbar;
