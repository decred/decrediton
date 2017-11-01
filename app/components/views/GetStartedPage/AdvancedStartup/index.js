import {AdvancedHeader, AdvancedBody} from "./Form";

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
      isSubmitedRemoteForm: false,
      isSubmitedDiffAppdataForm: false,
      isSubmited: false,
      hasErrors: false,
      remoteFormHasErrors: false,
      diffAppdataFormHasErrors: false,
      rpcuserFilled: false,
      rpcpasswordFilled: false,
      rpccertFilled: false,
      rpcportFilled: false,
      rpchostFilled: false,
      rpcappdataFilled: false,
    };
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    return (
      <AdvancedBody
      {...{
        ...this.props,
        ...this.state,
        ...substruct({
          skipAdvancedDaemon: null,
          onSubmitRemoteForm: null,
          onSubmitDiffAppdataForm: null,
          onChangeRpcuser: null,
          onChangeRpcpass: null,
          onChangeRpccert: null,
          onChangeRpchost: null,
          onChangeRpcport: null,
          onChangeRpcappdata: null,
        }, this)
      }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  getRemoteFormIsValid() {
    const { rpcuserFilled, rpcpasswordFilled, rpccertFilled, rpcportFilled, rpchostFilled } = this.state;

    if (!rpcuserFilled || !rpcpasswordFilled || !rpccertFilled || !rpcportFilled || !rpchostFilled ) {
      this.setState({
        remoteFormHasErrors: true,
        hasErrors: true,
      });
      return false;
    }
    this.setState({
      remoteFormHasErrors: false,
      hasErrors: false,
    });
    return true;
  }

  getDiffAppdataFormIsValid() {
    const { rpcappdataFilled } = this.state;
    if (!rpcappdataFilled) {
      this.setState({
        diffAppdataFormHasErrors: true,
        hasErrors: true,
      });
      return false;
    }
    this.setState({
      diffAppdataFormHasErrors: false,
      hasErrors: false
    });
    return true;
  }

  onChangeRpcuser(rpcuser) {
    if (!rpcuser)
      return this.setState({ rpcuserFilled: false });
    this.setState({ rpcuserFilled: true });
  }

  onChangeRpcpass(rpcpass) {
    if (!rpcpass)
      return this.setState({ rpcpasswordFilled: false });
    this.setState({ rpcpasswordFilled: true });
  }

  onChangeRpccert(rpccert) {
    if (!rpccert)
      return this.setState({ rpccertFilled: false });
    this.setState({ rpccertFilled: true });
  }

  onChangeRpchost(rpchost) {
    if (!rpchost)
      return this.setState({ rpchostFilled: false });
    this.setState({ rpchostFilled: true });
  }

  onChangeRpcport(rpcport) {
    if (!rpcport)
      return this.setState({ rpcportFilled: false });
    this.setState({ rpcportFilled: true });
  }

  onChangeRpcappdata(rpcappdata) {
    if (!rpcappdata)
      return this.setState({ rpcappdataFilled: false });
    this.setState({ rpcappdataFilled: true });
  }

  onSubmitRemoteForm(args) {
    this.setState({
      isSubmitedRemoteForm: true,
      isSubmited: true,
    });
    if (this.getRemoteFormIsValid())
      this.props.doStartAdvancedDaemon(args, 1);
  }

  onSubmitDiffAppdataForm(args) {
    this.setState({
      isSubmitedDiffAppdataForm: true,
      isSubmited: true,
    });
    if (this.getDiffAppdataFormIsValid())
      this.props.doStartAdvancedDaemon(args, 2);
  }

  skipAdvancedDaemon(){
    this.props.doStartAdvancedDaemon();
  }
}

export { AdvancedStartupHeader, AdvancedStartupBody };
