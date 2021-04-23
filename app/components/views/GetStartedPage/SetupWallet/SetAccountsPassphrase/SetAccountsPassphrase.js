import { Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import styles from "./SettingAccountsPassphrase.module.css";

const SetAccountsPassphrase = ({
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
      <Subtitle className={styles.subtitle} title={title} />
      <div className={styles.description}>{description}</div>

      {error && <div className="error">{error}</div>}
      <div className={styles.buttonWrapper}>
        <PassphraseModalButton
          modalTitle={<T id="process.settingPassAccts.title" m="Passphrase" />}
          modalClassName={styles.passphraseModal}
          onSubmit={onSubmitContinue}
          buttonLabel={<T id="process.settingPassAccts.button" m="Continue" />}
          disabled={isProcessingManaged}
          loading={isProcessingManaged}
        />
      </div>
    </div>
  );
};

export default SetAccountsPassphrase;
