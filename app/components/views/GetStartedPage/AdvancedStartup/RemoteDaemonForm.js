import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput, PasswordInput, PathBrowseInput } from "inputs";

const messages = defineMessages({
  messageLoginPlaceholder: {
    id: "login.form.rpcuser.placeholder",
    defaultMessage: "RPC Username",
  },
  passphraseFieldPlaceholder: {
    id: "login.form.rpcpassword.placeholder",
    defaultMessage: "RPC Password",
  },
  certFieldPlaceholder: {
    id: "login.form.rpccert.placeholder.",
    defaultMessage: "RPC Certificate path",
  },
  hostFieldPlaceholder: {
    id: "login.form.rpchost.placeholder.",
    defaultMessage: "RPC Host",
  },
  portFieldPlaceholder: {
    id: "login.form.rpcport.placeholder.",
    defaultMessage: "RPC Port",
  },
});

const RemoteDaemonForm = ({
  setRpcUser,
  setRpcPass,
  setRpcCert,
  setRpcHost,
  setRpcPort,
  rpc_user,
  rpc_password,
  rpc_cert,
  rpc_host,
  rpc_port,
  rpcUserHasFailedAttempt,
  rpcPasswordHasFailedAttempt,
  rpcHostHasFailedAttempt,
  rpcPortHasFailedAttempt,
  rpcCertHasFailedAttempt,
  intl
}) => {
  return (
    <Aux>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpcuser" m="RPC User" />:
        </div>
        <div className="advanced-daemon-input">
          <TextInput
            required
            value={rpc_user}
            onChange={(e) => setRpcUser(e.target.value)}
            placeholder={intl.formatMessage(messages.messageLoginPlaceholder)}
            showErrors={rpcUserHasFailedAttempt}
          />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpcpass" m="RPC Password" />:
        </div>
        <div className="advanced-daemon-input">
          <PasswordInput
            required
            value={rpc_password}
            onChange={(e) => setRpcPass(e.target.value)}
            placeholder={intl.formatMessage(messages.passphraseFieldPlaceholder)}
            showErrors={rpcPasswordHasFailedAttempt}
          />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpccert" m="RPC Cert Path" />:
        </div>
        <div className="advanced-daemon-input">
          <PathBrowseInput
            required
            type="file"
            value={rpc_cert}
            onChange={(value) => setRpcCert(value)}
            placeholder={intl.formatMessage(messages.certFieldPlaceholder)}
            showErrors={rpcCertHasFailedAttempt}
          />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpchost" m="RPC Host" />:
        </div>
        <div className="advanced-daemon-input">
          <TextInput
            required
            value={rpc_host}
            onChange={(e) => setRpcHost(e.target.value)}
            placeholder={intl.formatMessage(messages.hostFieldPlaceholder)}
            showErrors={rpcHostHasFailedAttempt}
          />
        </div>
      </div>
      <div className="advanced-daemon-row">
        <div className="advanced-daemon-label">
          <T id="advanced.remote.rpcport" m="RPC Port" />:
        </div>
        <div className="advanced-daemon-input">
          <TextInput
            required
            value={rpc_port}
            onChange={(e) => setRpcPort(e.target.value)}
            placeholder={intl.formatMessage(messages.portFieldPlaceholder)}
            showErrors={rpcPortHasFailedAttempt}
          />
        </div>
      </div>
    </Aux>
  );
};

export default RemoteDaemonForm;
