import {AdvancedHeader, AdvancedBody} from "./Form";
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
      rpcuser: rpc_user,
      rpcpass: rpc_password,
      rpccert: rpc_cert,
      rpcport: rpc_host,
      rpchost: rpc_port,
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
    const {
      rpcuser,
      rpcpass,
      rpccert,
      rpcport,
      rpchost,
      appData,
      sideActive
    } = this.state;
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
        sideActive,
        setRpcUser,
        setRpcPass,
        setRpcCert,
        setRpcHost,
        setRpcPort,
        setAppData,
        rpcuser,
        rpcpass,
        rpccert,
        rpcport,
        rpchost,
        appData,
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
    const { rpcuser, rpcpass, rpccert, rpchost, rpcport } = this.state;
    let args = {rpcuser, rpcpass, rpccert, rpchost, rpcport};
    this.props.onStartDaemon(args);
  }

  onSubmitAppData() {
    if (!this.isAppDataValid()) return;
    console.log(this.state.appData);
    this.props.onStartDaemon(null, this.state.appData);
  }

  isRemoteValid() {
    const { rpcuser, rpcpass, rpccert, rpchost, rpcport } = this.state;
    return !!(rpcuser && rpcpass && rpccert && rpchost && rpcport);
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

export { AdvancedStartupHeader, AdvancedStartupBody };
