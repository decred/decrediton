import { FormattedMessage as T, defineMessages } from "react-intl";
import { PathBrowseInput } from "inputs";
import { Label, Input } from "../../helpers";
import styles from "./AppDataForm.module.css";

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
    <Label className={styles.label}>
      <T id="login.form.appdata.label" m="Daemon Data Directory" />:
    </Label>
    <Input className={styles.input}>
      <PathBrowseInput
        required
        type="directory"
        value={appdata}
        onChange={(value) => setAppData(value)}
        placeholder={intl.formatMessage(messages.appdataFieldPlaceholder)}
        showErrors={appDataHasFailedAttempt}
      />
    </Input>
  </>
);

export default AppDataForm;
