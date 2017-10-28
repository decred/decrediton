import React from "react";
import InputField from "Form/InputField";
import { Field, reduxForm } from "redux-form";
import { FormattedMessage as T, defineMessages } from "react-intl";
import "style/LoginForm.less";

const messages = defineMessages({
  appdataFieldLabel: {
    id: "login.form.appdata.label",
    defaultMessage: "Aplication Path:",
  },
  appdataFieldPlaceholder: {
    id: "login.form.appdata.placeholder.",
    defaultMessage: "Enter your Path to application home directory",
  },
});

const LoginDiffAppdataForm = ({
  ...props,
  ...state,
  onSubmitDiffAppdataForm,
  onChangeRpcappdata,
  formatMessage
  }) => {

  const { handleSubmit } = props;
  const { diffAppdataFormHasErrors, isSubmitedDiffAppdataForm } = state;
  return (
    <div className="get-started-content-new-seed page-content">

      <form className="login-form" onSubmit={handleSubmit(onSubmitDiffAppdataForm)}>
        <div className="login-form-title">Login to a Different appdata directory</div>
        <Field
          label={formatMessage(messages.appdataFieldLabel)}
          name="rpcappdata"
          component={InputField}
          type="text"
          required
          onChange={(e) => onChangeRpcappdata(e.target.value)}
          placeholder={formatMessage(messages.appdataFieldPlaceholder)}
        />
        {isSubmitedDiffAppdataForm && diffAppdataFormHasErrors
          ? <div className="orange-warning">*Please Fill the appdata directory</div> : null}
        <button className="key-blue-button" type="submit" >
          <T id="securitycenter.sign.form.submit" m="Sign" />
        </button>
      </form>
    </div>
  );
};

export const LoginDiffAppdata = reduxForm({ form: "loginToDiffAppdataRPC/verify" })(LoginDiffAppdataForm);
