import { FormattedMessage as T, defineMessages } from "react-intl";
import { PathBrowseInput } from "inputs";

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
}) => {

  return (
    <>
      <div className="advanced-daemon-row appdataform">
        <div className="advanced-daemon-label">
          <T id="login.form.appdata.label" m="Daemon Data Directory" />
        </div>
        <div className="advanced-daemon-input">
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
};

export default AppDataForm;
