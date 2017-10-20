import React from "react";
import Header from "../../Header";
import KeyBlueButton from "../../KeyBlueButton";
import InputField from "../../Form/InputField";
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
});

export const LoginRPCHeader = () => (
  <Header getStarted
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Decrediton" />}
    headerMetaOverview={<T id="getStarted.header.startRpc.meta" m="Login to your RPC" />} />
);

const LoginRPCBodyForm = ({ ...props, }) => {
  const { onRetryStartRPC, handleSubmit, doStartAdvancedDaemon } = props;
  const { formatMessage } = props.intl;
  return (
    <div className="get-started-content-new-seed page-content">
      <form onSubmit={handleSubmit(doStartAdvancedDaemon)}>
        <Field
          label={formatMessage(messages.messageLoginLabel)}
          name="rpcuser"
          component={InputField}
          type="text"
          placeholder={formatMessage(messages.messageLoginPlaceholder)}
        />
        <Field
          label={formatMessage(messages.passphraseFieldLabel)}
          name="rpcpassword"
          component={InputField}
          type="password"
          placeholder={formatMessage(messages.passphraseFieldPlaceholder)}
        />
        <Field
          label={formatMessage(messages.certFieldLabel)}
          name="rpccert"
          component={InputField}
          type="text"
          placeholder={formatMessage(messages.certFieldPlaceholder)}
        />
        <button className="key-blue-button"  type="submit" >
          <T id="securitycenter.sign.form.submit" m="Sign" />
        </button>
      </form>


      <KeyBlueButton className="get-started-rpc-retry-button" onClick={() => onRetryStartRPC()}>
        <T id="getStarted.runningDaemon" m="Keep with running daemon" />
      </KeyBlueButton>
    </div>
  );
};

export const LoginRPCBody = reduxForm({ form: "login/verify" })(LoginRPCBodyForm);
