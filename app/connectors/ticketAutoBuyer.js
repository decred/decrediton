import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, substruct } from "../fp";
import * as selectors from "../selectors";
import * as controlActions from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  ...substruct({
    balanceToMaintain: null,
    maxFee: null,
    maxPriceRelative: null,
    maxPriceAbsolute: null,
    maxPerBlock: null,
    getTicketBuyerConfigResponse: null,
    isTicketAutoBuyerEnabled: null
  }, selectors)
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...substruct({
    clearStartAutoBuyerSuccess: null,
    clearStartAutoBuyerError: null,
    clearStopAutoBuyerSuccess: null,
    clearStopAutoBuyerError: null,
    startAutoBuyerAttempt: "onEnableTicketAutoBuyer",
    stopAutoBuyerAttempt: "onDisableTicketAutoBuyer",
    setTicketBuyerConfigAttempt: "onUpdateTicketAutoBuyerConfig"
  }, controlActions)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
