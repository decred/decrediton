import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput, PasswordInput } from "inputs";
import KeyBlueButton from "KeyBlueButton";
import "style/LoginForm.less";

const messages = defineMessages({
  messageLoginPlaceholder: {
    id: "login.form.rpcuser.placeholder",
    defaultMessage: "Enter your RPC User here",
  },
  passphraseFieldPlaceholder: {
    id: "login.form.rpcpassword.placeholder",
    defaultMessage: "Enter your RPC Password here",
  },
  certFieldPlaceholder: {
    id: "login.form.rpccert.placeholder.",
    defaultMessage: "Enter your RPC cert location here",
  },
  hostFieldPlaceholder: {
    id: "login.form.rpchost.placeholder.",
    defaultMessage: "Enter your RPC host here",
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
  rpcuser,
  rpcpass,
  rpccert,
  rpchost,
  rpcport,
  intl
  }) => {
  return (
    <Aux>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpcuser" m="RPC User:"/>:
        </div>
        <div className="advanced-daemon-input">
          <TextInput
            type="text"
            required
            value={rpcuser}
            onChange={(e) => setRpcUser(e.target.value)}
            placeholder={intl.formatMessage(messages.messageLoginPlaceholder)}
            showErrors
          />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpcpass" m="RPC Password:"/>:
        </div>
        <div className="advanced-daemon-input">
          <PasswordInput
            type="password"
            required
            value={rpcpass}
            onChange={(e) => setRpcPass(e.target.value)}
            placeholder={intl.formatMessage(messages.passphraseFieldPlaceholder)}
            showErrors
          />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpccert" m="RPC Cert Path:"/>:
        </div>
        <div className="advanced-daemon-input">
        <TextInput
          type="text"
          required
          value={rpccert}
          onChange={(e) => setRpcCert(e.target.value)}
          placeholder={intl.formatMessage(messages.certFieldPlaceholder)}
          showErrors
        />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpchost" m="RPC Host:"/>:
        </div>
        <div className="advanced-daemon-input">
        <TextInput
          type="text"
          required
          value={rpchost}
          onChange={(e) => setRpcHost(e.target.value)}
          placeholder={intl.formatMessage(messages.hostFieldPlaceholder)}
          showErrors
        />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpcport" m="RPC Port:"/>:
        </div>
        <div className="advanced-daemon-input">
        <TextInput
          type="text"
          required
          value={rpcport}
          onChange={(e) => setRpcPort(e.target.value)}
          placeholder={intl.formatMessage(messages.portFieldPlaceholder)}
          showErrors
        />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <KeyBlueButton onClick={onSubmitRemoteForm}>
          <T id="login.form.appdata.button" m="Connect to Remote" />
        </KeyBlueButton>
      </div>
    </Aux>
  );
};

export default RemoteDaemonForm;
