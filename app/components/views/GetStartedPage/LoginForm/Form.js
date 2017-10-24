import React from "react";
import Header from "Header";
import KeyBlueButton from "KeyBlueButton";
import InputField from "Form/InputField";
import { Field, reduxForm } from "redux-form";
import { FormattedMessage as T, defineMessages } from "react-intl";

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

const LoginRPCBodyForm = ({
   ...props,
   ...state,
   onSubmit,
   onChangeRpcuser,
   onChangeRpcpass,
   onChangeRpccert,
   onChangeRpcappdata,
  }) => {
  const { onRetryStartRPC, handleSubmit } = props;
  const { rpcuserFilled, rpcpasswordFilled, rpccertFilled, rpcappdataFilled } = state
  const { formatMessage } = props.intl;

  return (
    <div className="get-started-content-new-seed page-content">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field
          label={formatMessage(messages.messageLoginLabel)}
          name="rpcuser"
          component={InputField}
          type="text"
          required
          onChange={(e) => onChangeRpcuser(e.target.value)}
          placeholder={formatMessage(messages.messageLoginPlaceholder)}
        />
        {}
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
          label={formatMessage(messages.appdataFieldLabel)}
          name="appdata"
          component={InputField}
          type="text"
          required
          onChange={(e) => onChangeRpcappdata(e.target.value)}
          placeholder={formatMessage(messages.appdataFieldPlaceholder)}
        />
        <button className="key-blue-button"  type="submit" >
          <T id="securitycenter.sign.form.submit" m="Sign" />
        </button>
      </form>
    </div>
  );
};

export const LoginRPCBody = reduxForm({ form: "login/verify" })(LoginRPCBodyForm);
