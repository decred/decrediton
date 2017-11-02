import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput, PasswordInput } from "inputs";
import KeyBlueButton from "KeyBlueButton";
import "style/LoginForm.less";

const messages = defineMessages({
  messageLoginLabel: {
    id: "login.form.rpcuser.label",
    defaultMessage: "RPC User ",
  },
  messageLoginPlaceholder: {
    id: "login.form.rpcuser.placeholder",
    defaultMessage: "Enter your RPC User here",
  },
  passphraseFieldLabel: {
    id: "login.form.rpcpassword.label",
    defaultMessage: "RPC Password:",
  },
  passphraseFieldPlaceholder: {
    id: "login.form.rpcpassword.placeholder",
    defaultMessage: "Enter your RPC Password here",
  },
  certFieldLabel: {
    id: "login.form.rpccert.label",
    defaultMessage: "RPC Cert:",
  },
  certFieldPlaceholder: {
    id: "login.form.rpccert.placeholder.",
    defaultMessage: "Enter your RPC cert location here",
  },
  hostFieldLabel: {
    id: "login.form.rpchost.label",
    defaultMessage: "RPC Host:",
  },
  hostFieldPlaceholder: {
    id: "login.form.rpchost.placeholder.",
    defaultMessage: "Enter your RPC host here",
  },
  portFieldLabel: {
    id: "login.form.rpcport.label",
    defaultMessage: "RPC Port:",
  },
  portFieldPlaceholder: {
    id: "login.form.rpcport.placeholder.",
    defaultMessage: "Enter your RPC port here",
  },
});

const RemoteDaemonForm = ({
  onSubmitRemoteForm,
  setRpcUser,
  setRpcPass,
  setRpcCert,
  setRpcHost,
  setRpcPort,
  intl
  }) => {
  return (
    <div className="get-started-content-new-seed page-content">
      <div className="login-form">
        <TextInput
          label={intl.formatMessage(messages.messageLoginLabel)}
          type="text"
          required
          onChange={(e) => setRpcUser(e.target.value)}
          placeholder={intl.formatMessage(messages.messageLoginPlaceholder)}
          showErrors
        />
        <PasswordInput
          label={intl.formatMessage(messages.passphraseFieldLabel)}
          type="password"
          required
          onChange={(e) => setRpcPass(e.target.value)}
          placeholder={intl.formatMessage(messages.passphraseFieldPlaceholder)}
          showErrors
        />
        <TextInput
          label={intl.formatMessage(messages.certFieldLabel)}
          type="text"
          required
          onChange={(e) => setRpcCert(e.target.value)}
          placeholder={intl.formatMessage(messages.certFieldPlaceholder)}
          showErrors
        />
        <TextInput
          label={intl.formatMessage(messages.hostFieldLabel)}
          type="text"
          required
          onChange={(e) => setRpcHost(e.target.value)}
          placeholder={intl.formatMessage(messages.hostFieldPlaceholder)}
          showErrors
        />
        <TextInput
          label={intl.formatMessage(messages.portFieldLabel)}
          type="text"
          required
          onChange={(e) => setRpcPort(e.target.value)}
          placeholder={intl.formatMessage(messages.portFieldPlaceholder)}
          showErrors
        />
        <KeyBlueButton onClick={onSubmitRemoteForm}>
            <T id="login.form.appdata.button" m="Connect to Remote" />
        </KeyBlueButton>
      </div>
    </div>
  );
};

export default RemoteDaemonForm;
