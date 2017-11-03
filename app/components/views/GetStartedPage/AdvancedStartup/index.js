import {AdvancedHeader, AdvancedBody} from "./Form";
import { substruct } from "fp";

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
    return {
      sideActive: false,
      rpcuser: "",
      rpcpass: "",
      rpccert: "",
      rpcport: "",
      rpchost: "",
      appData: "",
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
    this.setState({ rpcuser });
  }

  setRpcPass(rpcpass) {
    this.setState({ rpcpass });
  }

  setRpcHost(rpchost) {
    this.setState({ rpchost });
  }

  setRpcPort(rpcport) {
    this.setState({ rpcport });
  }

  setRpcCert(rpccert) {
    this.setState({ rpccert });
  }

  setAppData(appData) {
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
