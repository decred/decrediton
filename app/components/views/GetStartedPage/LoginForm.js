import React from "react";
import Header from "Header";
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
  appdataFieldLabel: {
    id: "login.form.appdata.label",
    defaultMessage: "Aplication Path:",
  },
  appdataFieldPlaceholder: {
    id: "login.form.appdata.placeholder.",
    defaultMessage: "Enter your Path to application home directory",
  },
});

export const LoginRPCHeader = () => (
  <Header getStarted
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Decrediton" />}
    headerMetaOverview={<T id="getStarted.header.startRpc.meta" m="Login to your RPC" />} />
);

const LoginRPCRemoteForm = ({
   ...props,
  ...state,
  onSubmitRemoteForm,
  onChangeRpcuser,
  onChangeRpcpass,
  onChangeRpccert,
  changeForm,
  intl: { formatMessage }

  }) => {
  const { handleSubmit } = props;
  const { remoteFormHasErrors, isSubmitedRemoteForm } = state;

  return (
    <div className="get-started-content-new-seed page-content">
      <div>
        <a className="key-blue-button" onClick={() => changeForm(1)}>Select Remote Form</a>
        <a className="key-blue-button" onClick={() => changeForm(2)}>Select other app data directory Form</a>
      </div>
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

const LoginDiffAppdataForm = ({
  ...props,
  ...state,
  onSubmitDiffAppdataForm,
  onChangeRpcappdata,
  onChangeRpccert,
  changeForm,
  intl: { formatMessage }
 }) => {
  const { handleSubmit } = props;
  const { diffAppdataFormHasErrors, isSubmitedDiffAppdataForm } = state;

  return (
    <div className="get-started-content-new-seed page-content">
      <div>
        <a className="key-blue-button" onClick={() => changeForm(1)}>Select Remote Form</a>
        <a className="key-blue-button" onClick={() => changeForm(2)}>Select other app data directory Form</a>
      </div>
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
        <Field
          label={formatMessage(messages.certFieldLabel)}
          name="rpccert"
          component={InputField}
          type="text"
          onChange={(e) => onChangeRpccert(e.target.value)}
          placeholder={formatMessage(messages.certFieldPlaceholder)}
        />
        {isSubmitedDiffAppdataForm && diffAppdataFormHasErrors
          ? <div className="orange-warning">*Please Fill the app data directory</div> : null}
        <button className="key-blue-button" type="submit" >
          <T id="securitycenter.sign.form.submit" m="Sign" />
        </button>
      </form>
    </div>
  );
};

export const LoginRPCRemote = reduxForm({ form: "loginToRemoteRPC/verify" })(LoginRPCRemoteForm);
export const LoginDiffAppdata = reduxForm({ form: "loginToDiffAppdataRPC/verify" })(LoginDiffAppdataForm);
