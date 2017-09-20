import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  isTestNet: sel.isTestNet,
  balances: sel.balances,
  synced: sel.synced,
  currentBlockHeight: sel.currentBlockHeight,
  timeBackString: sel.timeBackString,
  totalBalance: sel.totalBalance
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateBlockTimeSince: ca.updateBlockTimeSince
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
