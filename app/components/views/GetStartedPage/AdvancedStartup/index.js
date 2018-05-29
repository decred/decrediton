import { AdvancedHeader, AdvancedBody } from "./Form";
import Error from "./Error";
import { setAppdataPath, getAppdataPath, getRemoteCredentials, setRemoteCredentials } from "config.js";

@autobind
class AdvancedStartupHeader extends React.Component {
  render() {
    return (<AdvancedHeader
      {...{
        ...this.props
      }}
    />);
  }

}

@autobind
class AdvancedStartupBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    const { rpc_password, rpc_user, rpc_cert, rpc_host, rpc_port } = getRemoteCredentials();
    return {
      sideActive: true,
      rpc_user: rpc_user,
      rpc_password: rpc_password,
      rpc_cert: rpc_cert,
      rpc_host: rpc_host,
      rpc_port: rpc_port,
      rpcUserHasFailedAttempt: false,
      rpcPasswordHasFailedAttempt: false,
      rpcHostHasFailedAttempt: false,
      rpcPortHasFailedAttempt: false,
      rpcCertHasFailedAttempt: false,
      appDataHasFailedAttempt: false,
      appData: getAppdataPath(),
    };
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    const {
      setRpcUser,
      setRpcPass,
      setRpcCert,
      setRpcHost,
      setRpcPort,
      setAppData,
      onSubmitAppDataForm,
      onSubmitRemoteForm,
      skipAdvancedDaemon,
      onShowRemote,
      onShowAppData,
    } = this;
    return (
      <AdvancedBody
        {...{
          ...this.props,
          ...this.state,
          onSubmitAppDataForm,
          onSubmitRemoteForm,
          skipAdvancedDaemon,
          onShowRemote,
          onShowAppData,
          setRpcUser,
          setRpcPass,
          setRpcCert,
          setRpcHost,
          setRpcPort,
          setAppData,
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  setRpcUser(rpc_user) {
    if (rpc_user == "") {
      this.setState({ rpcUserHasFailedAttempt: true });
    }
    this.setState({ rpc_user });
  }

  setRpcPass(rpc_password) {
    if (rpc_password == "") {
      this.setState({ rpcPasswordHasFailedAttempt: true });
    }
    this.setState({ rpc_password });
  }

  setRpcHost(rpc_host) {
    if (rpc_host == "") {
      this.setState({ rpcHostHasFailedAttempt: true });
    }
    this.setState({ rpc_host });
  }

  setRpcPort(rpc_port) {
    if (rpc_port == "") {
      this.setState({ rpcPortHasFailedAttempt: true });
    }
    this.setState({ rpc_port });
  }

  setRpcCert(rpc_cert) {
    if (rpc_cert == "") {
      this.setState({ rpcCertHasFailedAttempt: true });
    }
    this.setState({ rpc_cert });
  }

  setAppData(appData) {
    if (appData == "") {
      this.setState({ appDataHasFailedAttempt: true });
    }
    this.setState({ appData });
  }

  onSubmitRemoteForm() {
    if (!this.isRemoteValid()) {
      this.setState({ rpcUserHasFailedAttempt: true, rpcPasswordHasFailedAttempt: true, rpcHostHasFailedAttempt: true, rpcPortHasFailedAttempt: true, rpcCertHasFailedAttempt: true });
      return;
    }
    const { rpc_user, rpc_password, rpc_cert, rpc_host, rpc_port } = this.state;
    setRemoteCredentials("rpc_user", rpc_user);
    setRemoteCredentials("rpc_password", rpc_password);
    setRemoteCredentials("rpc_host", rpc_host);
    setRemoteCredentials("rpc_port", rpc_port);
    setRemoteCredentials("rpc_cert", rpc_cert);
    let args = { rpc_user, rpc_password, rpc_cert, rpc_host, rpc_port };
    this.props.onStartDaemon(args);
  }

  onSubmitAppDataForm() {
    const { appData } = this.state;
    if (!this.isAppDataValid()) {
      this.setState({ appDataHasFailedAttempt: true });
      return;
    }
    console.log(!this.isAppDataValid(), !!(appData), appData);
    setAppdataPath(appData);
    this.props.onStartDaemon(null, appData);
  }

  isRemoteValid() {
    const { rpc_user, rpc_password, rpc_cert, rpc_host, rpc_port } = this.state;
    return !!(rpc_user && rpc_password && rpc_cert && rpc_host && rpc_port);
  }

  isAppDataValid() {
    return !!(this.state.appData);
  }

  skipAdvancedDaemon(){
    this.props.onStartDaemon();
  }

  onShowRemote() {
    this.setState({ sideActive: false });
  }
  onShowAppData() {
    this.setState({ sideActive: true });
  }
}

export { AdvancedStartupHeader, AdvancedStartupBody, Error as RemoteAppdataError };
