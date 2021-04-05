import DefaultModal from "../Modal";
import { InvisibleButton, DangerButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { TextInput } from "inputs";
import { classNames } from "pi-ui";
import styles from "./SendFromUnmixedAccountModal.module.css";

const SendFromUnmixedAccountContent = ({
  show,
  onCancelModal,
  onSubmit,
  copyConfirmationPhrase,
  typedConfirmationPhrase,
  onTypedConfirmationPhraseChanged
}) => (
  <DefaultModal className={styles.confirmSendFromUnmixed} {...{ show }}>
    <div className={styles.titleConfirmSendFromUnmixed}>
      <T id="SendFromUnmixed.titleWarning" m="Sending from Unmixed Accounts" />
    </div>
    <div>
      <div className={styles.warningText}>
        <Documentation name="SendFromUnmixedInfo" />
        <T
          id="SendFromUnmixed.confirmPhraseInstruction"
          m="Please type {confirmationPhrase} to allow sending from unmixed accounts."
          values={{
            confirmationPhrase: (
              <span className={classNames("mono", styles.phrase)}>
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
    <div className={styles.toolbar}>
      <DangerButton
        className={styles.confirmButton}
        onClick={onSubmit}
        disabled={
          typedConfirmationPhrase.toLowerCase() !==
          copyConfirmationPhrase.toLowerCase()
        }>
        <T
          id="SendFromUnmixed.btnConfirm"
          m="Enable sending from unmixed accounts"
        />
      </DangerButton>
      <InvisibleButton className={styles.closeButton} onClick={onCancelModal}>
        <T id="SendFromUnmixed.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </DefaultModal>
);

export default SendFromUnmixedAccountContent;
