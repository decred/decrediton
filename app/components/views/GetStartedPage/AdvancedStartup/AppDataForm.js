import { FormattedMessage as T, defineMessages } from "react-intl";
import { PathBrowseInput } from "inputs";
import { KeyBlueButton } from "buttons";
import "style/LoginForm.less";

const messages = defineMessages({
  appdataFieldPlaceholder: {
    id: "login.form.appdata.placeholder",
    defaultMessage: "Enter your Path to application home directory",
  },
});

const AppDataForm = ({
  onSubmitAppData,
  setAppData,
  appData,
  intl
}) => {

  return (
    <Aux>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="login.form.appdata.label" m="Daemon Data Directory" />:
        </div>
        <div className="advanced-daemon-input">
          <PathBrowseInput
            type="directory"
            value={appData}
            onChange={(value) => setAppData(value)}
            placeholder={intl.formatMessage(messages.appdataFieldPlaceholder)}
          />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <KeyBlueButton onClick={onSubmitAppData}>
          <T id="login.form.appdata.button" m="Start AppData Daemon" />
        </KeyBlueButton>
      </div>
    </Aux>
  );
};

export default AppDataForm;
