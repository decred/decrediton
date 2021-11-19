import { Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import styles from "./SettingAccountsPassphrase.module.css";
import { useDaemonStartup } from "hooks";

const SetAccountsPassphrase = ({
  onSubmitAccountsPassphrase,
  title,
  description,
  error
}) => {
  const { isSettingAccountsPassphrase } = useDaemonStartup();

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
          disabled={isSettingAccountsPassphrase}
          loading={isSettingAccountsPassphrase}
        />
      </div>
    </div>
  );
};

export default SetAccountsPassphrase;
