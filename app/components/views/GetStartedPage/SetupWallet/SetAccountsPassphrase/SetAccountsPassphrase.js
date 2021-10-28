import { Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import styles from "./SettingAccountsPassphrase.module.css";

const SetAccountsPassphrase = ({
  onSubmitAccountsPassphrase,
  title,
  description,
  error,
  isProcessingManaged
}) => {
  return (
    <div className={styles.content}>
      <Subtitle className={styles.subtitle} title={title} />
      <div className={styles.description}>{description}</div>

      {error && <div className="error">{error}</div>}
      <div className={styles.buttonWrapper}>
        <PassphraseModalButton
          modalTitle={<T id="process.settingPassAccts.title" m="Passphrase" />}
          modalClassName={styles.passphraseModal}
          onSubmit={onSubmitAccountsPassphrase}
          buttonLabel={<T id="process.settingPassAccts.button" m="Continue" />}
          disabled={isProcessingManaged}
          loading={isProcessingManaged}
        />
      </div>
    </div>
  );
};

export default SetAccountsPassphrase;
