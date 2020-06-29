import { classNames } from "pi-ui";
import { FormattedMessage as T, defineMessages } from "react-intl";
import { PathBrowseInput } from "inputs";
import styles from "../GetStarted.module.css";

const messages = defineMessages({
  appdataFieldPlaceholder: {
    id: "login.form.appdata.placeholder",
    defaultMessage: "Daemon Data Directory"
  }
});

const AppDataForm = ({
  setAppData,
  appdata,
  appDataHasFailedAttempt,
  intl
}) => (
  <>
    <div className={classNames(styles.advancedDeamonRow, styles.dataForm)}>
      <div className={styles.daemonLabel}>
        <T id="login.form.appdata.label" m="Daemon Data Directory" />:
      </div>
      <div className={styles.daemonInput}>
        <PathBrowseInput
          required
          type="directory"
          value={appdata}
          onChange={(value) => setAppData(value)}
          placeholder={intl.formatMessage(messages.appdataFieldPlaceholder)}
          showErrors={appDataHasFailedAttempt}
        />
      </div>
    </div>
  </>
);

export default AppDataForm;
