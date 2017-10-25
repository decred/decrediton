import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  balanceToMaintain: sel.balanceToMaintain,
  maxFee: sel.maxFee,
  maxPriceRelative: sel.maxPriceRelative,
  maxPriceAbsolute: sel.maxPriceAbsolute,
  maxPerBlock: sel.maxPerBlock,
  getTicketBuyerConfigResponse: sel.getTicketBuyerConfigResponse,
  isTicketAutoBuyerEnabled: sel.isTicketAutoBuyerEnabled,
  currencyDisplay: sel.currencyDisplay
});

const mapDispatchToProps = dispatch => bindActionCreators({
  clearStartAutoBuyerSuccess: ca.clearStartAutoBuyerSuccess,
  clearStartAutoBuyerError: ca.clearStartAutoBuyerError,
  clearStopAutoBuyerSuccess: ca.clearStopAutoBuyerSuccess,
  clearStopAutoBuyerError: ca.clearStopAutoBuyerError,
  onEnableTicketAutoBuyer: ca.startAutoBuyerAttempt,
  onDisableTicketAutoBuyer: ca.stopAutoBuyerAttempt,
  onUpdateTicketAutoBuyerConfig: ca.setTicketBuyerConfigAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
