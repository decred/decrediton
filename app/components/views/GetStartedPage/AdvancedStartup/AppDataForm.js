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
  ...state,
  onSubmitDiffAppdataForm,
  onChangeRpcappdata,
  intl
  }) => {

  const { diffAppdataFormHasErrors, isSubmittedDiffAppdataForm } = state;
  return (
    <div className="get-started-content-new-seed page-content">
      <div className="login-form">
        <div className="stakepool-purchase-ticket-row">
          <div className="stakepool-purchase-ticket-label">
            <T id="login.form.appdata.label" m="Daemon Data Directory"/>:
          </div>
          <div className="stakepool-purchase-ticket-input">
            <div className="stakepool-input-form-purchase-ticket">
              <TextInput
                name="rpcappdata"
                type="text"
                showErrors
                required
                onChange={(e) => onChangeRpcappdata(e.target.value)}
                placeholder={intl.formatMessage(messages.appdataFieldPlaceholder)}
              />
            </div>
          </div>
          {isSubmittedDiffAppdataForm && diffAppdataFormHasErrors && <div className="orange-warning">*Please Fill the appdata directory</div>}
          <KeyBlueButton onClick={onSubmitDiffAppdataForm}>
            <T id="login.form.appdata.button" m="Start Decrediton" />
          </KeyBlueButton>
        </div>
      </div>
    </div>
  );
};

export default AppDataForm;
