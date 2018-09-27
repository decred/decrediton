import {
  RescanWalletFormHeader as RescanWalletHeader,
  RescanWalletFormBody
} from "./Form";

class RescanWalletBody extends React.Component {

  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.resetState();
    if(this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  getInitialState() {
    return {
      showLongWaitMessage: false
    };
  }

  render() {
    const { showLongWaitMessage } = this.state;
    const { isSPV,
      rescanEndBlock,
      rescanStartBlock,
      rescanCurrentBlock,
      syncRescanProgress,
    } = this.props;
    var rescanEnd = rescanEndBlock;
    var rescanStart = rescanStartBlock;
    var rescanCurrent = rescanCurrentBlock;
    rescanCurrent = syncRescanProgress;
    return (
      <RescanWalletFormBody
        {...{
          ...this.props,
          showLongWaitMessage,
          rescanEndBlock: rescanEnd,
          rescanStartBlock: rescanStart,
          rescanCurrentBlock: rescanCurrent,
          isSPV,
        }}
      />
    );
  }

  componentDidMount() {
    this.mounted = true;
    this.timeoutId = setTimeout(() => {
      if(this.mounted) {
        this.setState({ showLongWaitMessage: true });
      }
      delete this.timeoutId;
    }, 2000);
  }

  resetState() {
    this.setState(this.getInitialState());
  }

}
export { RescanWalletHeader, RescanWalletBody };
