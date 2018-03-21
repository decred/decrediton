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
  showingSidebar: sel.showingSidebar,
  showingSidebarMenu: sel.showingSidebarMenu,
  expandSideBar: sel.expandSideBar,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateBlockTimeSince: ca.updateBlockTimeSince,
  onExpandSideBar: sba.expandSideBar,
  onReduceSideBar: sba.reduceSideBar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
