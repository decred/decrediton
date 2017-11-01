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
  onChangeRpcuser,
  onChangeRpcpass,
  onChangeRpccert,
  onChangeRpchost,
  onChangeRpcport,
  intl
  }) => {
  return (
    <div className="get-started-content-new-seed page-content">
      <div className="login-form-title">Connect to a remote daemon</div>
      <div className="login-form">
        <TextInput
          label={intl.formatMessage(messages.messageLoginLabel)}
          type="text"
          required
          onChange={(e) => onChangeRpcuser(e.target.value)}
          placeholder={intl.formatMessage(messages.messageLoginPlaceholder)}
          showErrors
        />
        <PasswordInput
          label={intl.formatMessage(messages.passphraseFieldLabel)}
          type="password"
          required
          onChange={(e) => onChangeRpcpass(e.target.value)}
          placeholder={intl.formatMessage(messages.passphraseFieldPlaceholder)}
          showErrors
        />
        <TextInput
          label={intl.formatMessage(messages.certFieldLabel)}
          type="text"
          required
          onChange={(e) => onChangeRpccert(e.target.value)}
          placeholder={intl.formatMessage(messages.certFieldPlaceholder)}
          showErrors
        />
        <TextInput
          label={intl.formatMessage(messages.hostFieldLabel)}
          type="text"
          required
          onChange={(e) => onChangeRpchost(e.target.value)}
          placeholder={intl.formatMessage(messages.hostFieldPlaceholder)}
          showErrors
        />
        <TextInput
          label={intl.formatMessage(messages.portFieldLabel)}
          type="text"
          required
          onChange={(e) => onChangeRpcport(e.target.value)}
          placeholder={intl.formatMessage(messages.portFieldPlaceholder)}
          showErrors
        />
        <KeyBlueButton onClick={onSubmitRemoteForm}>
            <T id="login.form.appdata.button" m="Start Decrediton" />
        </KeyBlueButton>
      </div>
    </div>
  );
};

export default RemoteDaemonForm;
