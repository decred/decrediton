import Bar from "./Bar";
import { rescan, sideBar } from "connectors";

@autobind
class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingAccounts: false,
    };
  }

  render() {

    return (
      <Bar
        {...{
          isTestNet: this.props.isTestNet,
          balances: this.props.balances,
          synced: this.props.synced,
          currentHeight: this.props.currentBlockHeight,
          lastBlockTimestamp: this.props.lastBlockTimestamp,
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

export default sideBar(rescan(SideBar));
