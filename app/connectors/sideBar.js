import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  isTestNet: sel.isTestNet,
  balances: sel.balances,
  currentBlockHeight: sel.currentBlockHeight,
  lastBlockTimestamp: sel.lastBlockTimestamp,
  totalBalance: sel.totalBalance,
  showingSidebar: sel.showingSidebar,
  showingSidebarMenu: sel.showingSidebarMenu,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateBlockTimeSince: ca.updateBlockTimeSince
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
