import DefaultModal from "../Modal";
import { InvisibleButton, DangerButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { TextInput } from "inputs";
import { classNames } from "pi-ui";
import styles from "./SeedCopyConfirmModal.module.css";

const SeedCopyConfirmModalContent = ({
  show,
  onCancelModal,
  onSubmit,
  copyConfirmationPhrase,
  typedConfirmationPhrase,
  onTypedConfirmationPhraseChanged
}) => (
  <DefaultModal className={styles.confirmSeedCopy} {...{ show }}>
    <div className={styles.titleWarningCopyModal}>
      <T id="seedCopyConfirm.titleWarning" m="Seed Clipboard Copy Warning" />
    </div>
    <form onSubmit={onSubmit}>
      <div>
        <div className={styles.warningText}>
          <Documentation name="SeedCopyWarning" />
          <T
            id="seedCopyConfirmModal.confirmPhraseInstruction"
            m="Please type {confirmationPhrase} to copy the seed."
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
          id="confirmInput"
          autoFocus
          value={typedConfirmationPhrase}
          onChange={(e) => onTypedConfirmationPhraseChanged(e.target.value)}
          className={styles.contentInput}
          onKeyDownSubmit={() =>
            typedConfirmationPhrase.toLowerCase() ===
              copyConfirmationPhrase.toLowerCase() && onSubmit()
          }
        />
      </div>
      <div className={styles.toolbar}>
        <DangerButton
          className={styles.confirmButton}
          onSubmit={onSubmit}
          disabled={
            typedConfirmationPhrase.toLowerCase() !==
            copyConfirmationPhrase.toLowerCase()
          }>
          <T id="seedCopyConfirm.btnConfirm" m="Confirm Seed Copy" />
        </DangerButton>
        <InvisibleButton
          className={styles.closeButton}
          onClick={onCancelModal}
          ariaLabel="Cancel seed copy">
          <T id="seedCopyConfirm.btnCancel" m="Cancel" />
        </InvisibleButton>
      </div>
    </form>
  </DefaultModal>
);

export default SeedCopyConfirmModalContent;
