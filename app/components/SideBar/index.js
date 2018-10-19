import Bar from "./Bar";
import { rescan, sideBar } from "connectors";
import ReactTimeout from "react-timeout";

@autobind
class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingAccounts: false,
      ...this.getBlockDate(props.lastBlockTimestamp)
    };
  }

  componentWillReceiveProps(nextProps) {
    const { lastBlockTimestamp } = this.props;
    if (lastBlockTimestamp !== nextProps.lastBlockTimestamp) {
      this.setState(this.getBlockDate(nextProps.lastBlockTimestamp));
    }
  }

  getBlockDate(lastBlockTimestamp) {
    let lastBlockDate;
    let lastBlockIsRecent = false;
    let updateRecentTimer = this.state ? this.state.updateRecentTimer : null;

    if (lastBlockTimestamp) {
      if (updateRecentTimer) {
        this.props.clearTimeout(updateRecentTimer);
        updateRecentTimer = null;
      }

      const now = new Date();
      lastBlockDate = new Date(lastBlockTimestamp*1000);
      const timeFromLastBlock = now.getTime() - lastBlockDate.getTime();
      lastBlockIsRecent = timeFromLastBlock < 60000;
      if (lastBlockIsRecent) {
        updateRecentTimer = this.props.setTimeout(this.updateRecentBlockTime, 60000 - timeFromLastBlock);
      }
    }
    return { lastBlockDate, lastBlockIsRecent, updateRecentTimer };
  }

  updateRecentBlockTime() {
    this.setState(this.getBlockDate(this.props.lastBlockTimestamp));
  }

  render() {

    return (
      <Bar
        {...{
          isTestNet: this.props.isTestNet,
          balances: this.props.balances,
          synced: this.props.synced,
          currentHeight: this.props.currentBlockHeight,
          lastBlockDate: this.state.lastBlockDate,
          lastBlockIsRecent: this.state.lastBlockIsRecent,
          totalBalance: this.props.totalBalance,
          isShowingAccounts: this.state.isShowingAccounts,
          onShowAccounts: this.onShowAccounts,
          onHideAccounts: this.onHideAccounts,
          rescanRequest: this.props.rescanRequest,
          rescanAttempt: this.props.rescanAttempt,
          expandSideBar: this.props.expandSideBar,
          onExpandSideBar: this.props.onExpandSideBar,
          onReduceSideBar: this.props.onReduceSideBar,
          isWatchingOnly: this.props.isWatchingOnly,
        }}
      />
    );
  }

  onShowAccounts() {
    this.setState({ isShowingAccounts: true });
  }

  onHideAccounts() {
    this.setState({ isShowingAccounts: false });
  }
}

SideBar.propTypes = {
  expandSideBar: PropTypes.bool.isRequired,
};

export default sideBar(rescan(ReactTimeout(SideBar)));
