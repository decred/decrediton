import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  balanceToMaintain: sel.balanceToMaintain,
  isTicketAutoBuyerEnabled: sel.isTicketAutoBuyerEnabled,
  currencyDisplay: sel.currencyDisplay,
  ticketBuyerSettings: sel.ticketBuyerConfig,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  clearStartAutoBuyerSuccess: ca.clearStartAutoBuyerSuccess,
  clearStartAutoBuyerError: ca.clearStartAutoBuyerError,
  clearStopAutoBuyerSuccess: ca.clearStopAutoBuyerSuccess,
  clearStopAutoBuyerError: ca.clearStopAutoBuyerError,
  onEnableTicketAutoBuyer: ca.startTicketBuyerV2Attempt,
  onDisableTicketAutoBuyer: ca.ticketBuyerCancel,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
