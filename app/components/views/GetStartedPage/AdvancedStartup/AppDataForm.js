import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import KeyBlueButton from "KeyBlueButton";
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
    <div className="get-started-content-new-seed page-content">
      <div className="stakepool-purchase-ticket-row">
        <div className="stakepool-purchase-ticket-label">
          <T id="login.form.appdata.label" m="Daemon Data Directory:"/>:
        </div>
        <div className="stakepool-purchase-ticket-input">
          <div className="stakepool-input-form-purchase-ticket">
            <TextInput
              type="text"
              showErrors
              required
              value={appData}
              onChange={(e) => setAppData(e.target.value)}
              placeholder={intl.formatMessage(messages.appdataFieldPlaceholder)}
            />
          </div>
        </div>
        <KeyBlueButton onClick={onSubmitAppData}>
          <T id="login.form.appdata.button" m="Start AppData Daemon" />
        </KeyBlueButton>
      </div>
    </div>
  );
};

export default AppDataForm;
