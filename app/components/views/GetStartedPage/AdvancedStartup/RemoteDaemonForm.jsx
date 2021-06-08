import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput, PasswordInput, PathBrowseInput } from "inputs";
import { Label, Input, Row } from "../helpers";

const messages = defineMessages({
  messageLoginPlaceholder: {
    id: "login.form.rpcuser.placeholder",
    defaultMessage: "RPC Username"
  },
  passphraseFieldPlaceholder: {
    id: "login.form.rpcpassword.placeholder",
    defaultMessage: "RPC Password"
  },
  certFieldPlaceholder: {
    id: "login.form.rpccert.placeholder.",
    defaultMessage: "RPC Certificate path"
  },
  hostFieldPlaceholder: {
    id: "login.form.rpchost.placeholder.",
    defaultMessage: "RPC Host"
  },
  portFieldPlaceholder: {
    id: "login.form.rpcport.placeholder.",
    defaultMessage: "RPC Port"
  }
});

const RemoteDaemonForm = ({
  setRpcUser,
  setRpcPass,
  setRpcCert,
  setRpcHost,
  setRpcPort,
  rpc_user,
  rpc_pass,
  rpc_cert,
  rpc_host,
  rpc_port,
  rpcUserHasFailedAttempt,
  rpcPasswordHasFailedAttempt,
  rpcHostHasFailedAttempt,
  rpcPortHasFailedAttempt,
  rpcCertHasFailedAttempt,
  intl
}) => (
  <>
    <Row>
      <Label>
        <T id="advanced.remote.rpcuser" m="RPC User" />
      </Label>
      <Input>
        <TextInput
          id="rpc-user"
          required
          value={rpc_user}
          onChange={(e) => setRpcUser(e.target.value)}
          placeholder={intl.formatMessage(messages.messageLoginPlaceholder)}
          showErrors={rpcUserHasFailedAttempt}
        />
      </Input>
    </Row>
    <Row>
      <Label>
        <T id="advanced.remote.rpcpass" m="RPC Password" />
      </Label>
      <Input>
        <PasswordInput
          required
          id="rpc-pass"
          value={rpc_pass}
          onChange={(e) => setRpcPass(e.target.value)}
          placeholder={intl.formatMessage(messages.passphraseFieldPlaceholder)}
          showErrors={rpcPasswordHasFailedAttempt}
        />
      </Input>
    </Row>
    <Row>
      <Label>
        <T id="advanced.remote.rpccert" m="RPC Cert Path" />
      </Label>
      <Input>
        <PathBrowseInput
          required
          id="rpc-cert"
          type="file"
          value={rpc_cert}
          onChange={(value) => setRpcCert(value)}
          placeholder={intl.formatMessage(messages.certFieldPlaceholder)}
          showErrors={rpcCertHasFailedAttempt}
        />
      </Input>
    </Row>
    <Row>
      <Label>
        <T id="advanced.remote.rpchost" m="RPC Host" />
      </Label>
      <Input>
        <TextInput
          id="rpc-host"
          required
          value={rpc_host}
          onChange={(e) => setRpcHost(e.target.value)}
          placeholder={intl.formatMessage(messages.hostFieldPlaceholder)}
          showErrors={rpcHostHasFailedAttempt}
        />
      </Input>
    </Row>
    <Row>
      <Label>
        <T id="advanced.remote.rpcport" m="RPC Port" />
      </Label>
      <Input>
        <TextInput
          id="rpc-port"
          required
          value={rpc_port}
          onChange={(e) => setRpcPort(e.target.value)}
          placeholder={intl.formatMessage(messages.portFieldPlaceholder)}
          showErrors={rpcPortHasFailedAttempt}
        />
      </Input>
    </Row>
  </>
);

export default RemoteDaemonForm;
