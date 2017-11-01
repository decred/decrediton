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
  hostFieldLabel: {
    id: "login.form.rpchost.label",
    defaultMessage: "Host:",
  },
  hostFieldPlaceholder: {
    id: "login.form.rpchost.placeholder.",
    defaultMessage: "Enter your host here",
  },
  portFieldLabel: {
    id: "login.form.rpcport.label",
    defaultMessage: "Port:",
  },
  portFieldPlaceholder: {
    id: "login.form.rpcport.placeholder.",
    defaultMessage: "Enter your port here",
  },
});

const LoginRPCRemoteForm = ({
  ...props,
  ...state,
  onSubmitRemoteForm,
  onChangeRpcuser,
  onChangeRpcpass,
  onChangeRpccert,
  onChangeRpchost,
  onChangeRpcport,
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
        <Field
          label={formatMessage(messages.hostFieldLabel)}
          name="rpchost"
          component={InputField}
          type="text"
          required
          onChange={(e) => onChangeRpchost(e.target.value)}
          placeholder={formatMessage(messages.hostFieldPlaceholder)}
        />
        <Field
          label={formatMessage(messages.portFieldLabel)}
          name="rpcport"
          component={InputField}
          type="text"
          required
          onChange={(e) => onChangeRpcport(e.target.value)}
          placeholder={formatMessage(messages.portFieldPlaceholder)}
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
