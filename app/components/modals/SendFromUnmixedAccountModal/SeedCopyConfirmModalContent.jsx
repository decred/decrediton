import DefaultModal from "../Modal";
import { InvisibleButton, DangerButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { TextInput } from "inputs";
import { classNames } from "pi-ui";
import style from "../Modals.module.css";

const Modal = ({
  show,
  onCancelModal,
  onSubmit,
  copyConfirmationPhrase,
  typedConfirmationPhrase,
  onTypedConfirmationPhraseChanged
}) => (
  <DefaultModal className={style.confirmSendFromUnmixed} {...{ show }}>
    <div className={style.titleConfirmSendFromUnmixed}>
      <T id="seedCopyConfirm.titleWarning" m="Seed Clipboard Copy Warning" />
    </div>
    <div className={style.confirmSeedCopyContent}>
      <div className={style.confirmSeedCopyWarningText}>
        <Documentation name="SendFromUnmixedInfo" />
        <T
          id="seedCopyConfirmModal.confirmPhraseInstruction"
          m="Please type {confirmationPhrase} to allow sending from unmixed accounts."
          values={{
            confirmationPhrase: (
              <span className={classNames("mono", style.confirmSeedCopyPhrase)}>
                '{copyConfirmationPhrase}'
              </span>
            )
          }}
        />
      </div>
      <TextInput
        autoFocus
        value={typedConfirmationPhrase}
        onChange={(e) => onTypedConfirmationPhraseChanged(e.target.value)}
        onKeyDownSubmit={() =>
          typedConfirmationPhrase.toLowerCase() ===
            copyConfirmationPhrase.toLowerCase() && onSubmit()
        }
      />
    </div>
    <div className={style.confirmSeedCopyToolbar}>
      <DangerButton
        className={style.confirmConfirmButton}
        onClick={onSubmit}
        disabled={
          typedConfirmationPhrase.toLowerCase() !==
          copyConfirmationPhrase.toLowerCase()
        }>
        <T id="seedCopyConfirm.btnConfirm" m="Confirm Seed Copy" />
      </DangerButton>
      <InvisibleButton
        className={style.confirmCloseButton}
        onClick={onCancelModal}>
        <T id="seedCopyConfirm.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </DefaultModal>
);

export default Modal;
