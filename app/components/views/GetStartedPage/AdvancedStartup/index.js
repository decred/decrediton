import {AdvancedHeader, AdvancedBody} from "./Form";
import Error from "./Error";
import { setAppdataPath, getAppdataPath, getRemoteCredentials, setRemoteCredentials} from "config.js";

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
    const {rpc_password, rpc_user, rpc_cert, rpc_host, rpc_port} = getRemoteCredentials();
    return {
      sideActive: false,
      rpc_user: rpc_user,
      rpc_password: rpc_password,
      rpc_cert: rpc_cert,
      rpc_host: rpc_host,
      rpc_port: rpc_port,
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
      onSubmitAppData,
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
        onSubmitAppData,
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

  setRpcUser(rpcuser) {
    setRemoteCredentials("rpc_user", rpcuser)
    this.setState({ rpcuser });
  }

  setRpcPass(rpcpass) {
    setRemoteCredentials("rpc_password", rpcpass)
    this.setState({ rpcpass });
  }

  setRpcHost(rpchost) {
    setRemoteCredentials("rpc_host", rpchost)
    this.setState({ rpchost });
  }

  setRpcPort(rpcport) {
    setRemoteCredentials("rpc_port", rpcport)
    this.setState({ rpcport });
  }

  setRpcCert(rpccert) {
    setRemoteCredentials("rpc_cert", rpccert)
    this.setState({ rpccert });
  }

  setAppData(appData) {
    setAppdataPath(appData);
    this.setState({ appData });
  }

  onSubmitRemoteForm() {
    if (!this.isRemoteValid()) return;
    const { rpc_user, rpc_password, rpc_cert, rpc_host, rpc_port } = this.state;
    let args = {rpc_user, rpc_password, rpc_cert, rpc_host, rpc_port};
    this.props.onStartDaemon(args);
  }

  onSubmitAppData() {
    if (!this.isAppDataValid()) return;
    console.log(this.state.appData);
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
