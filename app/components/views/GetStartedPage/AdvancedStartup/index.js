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
    const { rpc_password, rpc_user, rpc_cert, rpc_host, rpc_port } = getRemoteCredentials(this.props.network == "testnet", this.props.walletName);
    return {
      sideActive: true,
      rpc_user: rpc_user,
      rpc_password: rpc_password,
      rpc_cert: rpc_cert,
      rpc_host: rpc_host,
      rpc_port: rpc_port,
      appData: getAppdataPath(this.props.network == "testnet", this.props.walletName),
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
    setRemoteCredentials(this.props.network == "testnet", this.props.walletName, "rpc_user", rpc_user);
    this.setState({ rpc_user });
  }

  setRpcPass(rpc_password) {
    setRemoteCredentials(this.props.network == "testnet", this.props.walletName, "rpc_password", rpc_password);
    this.setState({ rpc_password });
  }

  setRpcHost(rpc_host) {
    setRemoteCredentials(this.props.network == "testnet", this.props.walletName, "rpc_host", rpc_host);
    this.setState({ rpc_host });
  }

  setRpcPort(rpc_port) {
    setRemoteCredentials(this.props.network == "testnet", this.props.walletName, "rpc_port", rpc_port);
    this.setState({ rpc_port });
  }

  setRpcCert(rpc_cert) {
    setRemoteCredentials(this.props.network == "testnet", this.props.walletName, "rpc_cert", rpc_cert);
    this.setState({ rpc_cert });
  }

  setAppData(appData) {
    setAppdataPath(this.props.network == "testnet", appData, this.props.walletName);
    this.setState({ appData });
  }

  onSubmitRemoteForm() {
    if (!this.isRemoteValid()) return;
    const { rpc_user, rpc_password, rpc_cert, rpc_host, rpc_port } = this.state;
    let args = { rpc_user, rpc_password, rpc_cert, rpc_host, rpc_port };
    this.props.onStartDaemon(args);
  }

  onSubmitAppDataForm() {
    if (!this.isAppDataValid()) return;
    this.props.onStartDaemon(null, this.state.appData);
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
