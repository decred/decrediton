import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ClientActions";
import * as sba from "../actions/SidebarActions";

const mapStateToProps = selectorMap({
  isTestNet: sel.isTestNet,
  balances: sel.balances,
  currentBlockHeight: sel.currentBlockHeight,
  lastBlockTimestamp: sel.lastBlockTimestamp,
  totalBalance: sel.totalBalance,
  expandSideBar: sel.expandSideBar,
  isWatchingOnly: sel.isWatchingOnly,
  tsDate: sel.tsDate,
  sidebarOnBottom: sel.sidebarOnBottom,
  accountMixerRunning: sel.getAccountMixerRunning
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateBlockTimeSince: ca.updateBlockTimeSince,
      onExpandSideBar: sba.expandSideBar,
      onReduceSideBar: sba.reduceSideBar
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
