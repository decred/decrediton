import React from "react";
import InputField from "Form/InputField";
import { Field, reduxForm } from "redux-form";
import { FormattedMessage as T, defineMessages } from "react-intl";
import "style/LoginForm.less";

const messages = defineMessages({
  messageLoginLabel: {
    id: "login.form.rpcuser.label",
    defaultMessage: "Login: ",
  },
  messageLoginPlaceholder: {
    id: "login.form.rpcuser.placeholder",
    defaultMessage: "Enter your Login here",
  },
  passphraseFieldLabel: {
    id: "login.form.rpcpassword.label",
    defaultMessage: "Passphrase:",
  },
  passphraseFieldPlaceholder: {
    id: "login.form.rpcpassword.placeholder",
    defaultMessage: "Enter your passphrase here",
  },
  certFieldLabel: {
    id: "login.form.rpccert.label",
    defaultMessage: "Cert:",
  },
  certFieldPlaceholder: {
    id: "login.form.rpccert.placeholder.",
    defaultMessage: "Enter your cert location here",
  },
});

const LoginRPCRemoteForm = ({
  ...props,
  ...state,
  onSubmitRemoteForm,
  onChangeRpcuser,
  onChangeRpcpass,
  onChangeRpccert,
  formatMessage
  }) => {

  const { handleSubmit } = props;
  const { remoteFormHasErrors, isSubmitedRemoteForm } = state;
  return (
    <div className="get-started-content-new-seed page-content">

      <div className="login-form-title">Login to a remote rpc</div>
      <form className="login-form" onSubmit={handleSubmit(onSubmitRemoteForm)}>
        <Field
          label={formatMessage(messages.messageLoginLabel)}
          name="rpcuser"
          component={InputField}
          type="text"
          required
          onChange={(e) => onChangeRpcuser(e.target.value)}
          placeholder={formatMessage(messages.messageLoginPlaceholder)}
        />
        <Field
          label={formatMessage(messages.passphraseFieldLabel)}
          name="rpcpassword"
          component={InputField}
          type="password"
          required
          onChange={(e) => onChangeRpcpass(e.target.value)}
          placeholder={formatMessage(messages.passphraseFieldPlaceholder)}
        />
        <Field
          label={formatMessage(messages.certFieldLabel)}
          name="rpccert"
          component={InputField}
          type="text"
          required
          onChange={(e) => onChangeRpccert(e.target.value)}
          placeholder={formatMessage(messages.certFieldPlaceholder)}
        />
        {isSubmitedRemoteForm && remoteFormHasErrors ?
          <div className="orange-warning">*Please Fill All Fields</div> : null}
        <button className="key-blue-button" type="submit" >
          <T id="securitycenter.sign.form.submit" m="Sign" />
        </button>
      </form>
    </div>
  );
};

export const LoginRPCRemote = reduxForm({ form: "loginToRemoteRPC/verify" })(LoginRPCRemoteForm);