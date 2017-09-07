import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, substruct } from "../fp";
import * as selectors from "../selectors";
import * as controlActions from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  ...substruct({
    ticketPrice: null
  }, selectors)
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...substruct({
    purchaseTicketsAttempt: "onPurchaseTickets"
  }, controlActions)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
