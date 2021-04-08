import { Tooltip } from "pi-ui";
import { Subtitle } from "shared";
import { GoBackMsg } from "../../messages";
import { FormattedMessage as T } from "react-intl";
// XXX: change this import and move all styles to component's css module
import GetStartedStyles from "../../GetStarted.module.css";
import { PassphraseModalButton, InvisibleButton } from "buttons";
import styles from "./SettingAccountsPassphrase.module.css";

export default ({
  cancel,
  send,
  onProcessAccounts,
  title,
  description,
  error,
  isProcessingManaged
}) => {
  const onSubmitContinue = (passphrase) => {
    // send a continue so we can go to the loading state
    onProcessAccounts(passphrase)
      .then(() => send({ type: "CONTINUE" }))
      .catch((error) => {
        send({ type: "ERROR", error });
      });
    return;
  };
  return (
    <div className={styles.content}>
      <div className={GetStartedStyles.goBackScreenButtonArea}>
        {!isProcessingManaged && (
          <Tooltip content={<GoBackMsg />}>
            <div
              className={GetStartedStyles.goBackScreenButton}
              onClick={cancel}
            />
          </Tooltip>
        )}
      </div>
      <Subtitle className={styles.subtitle} title={title} />
      <div className={styles.description}>{description}</div>

      {error && <div className="error">{error}</div>}
      <div className={styles.buttonWrapper}>
        <PassphraseModalButton
          modalTitle={<T id="process.mangedTickets.title" m="Passphrase" />}
          modalClassName={styles.passphraseModal}
          onSubmit={onSubmitContinue}
          buttonLabel={<T id="process.mangedTickets.button" m="Continue" />}
          disabled={isProcessingManaged}
          loading={isProcessingManaged}
        />
        {!isProcessingManaged && (
          <InvisibleButton className={styles.skipButton} onClick={cancel}>
            <T id="process.mangedTickets.button.skip" m="Skip" />
          </InvisibleButton>
        )}
      </div>
    </div>
  );
};
