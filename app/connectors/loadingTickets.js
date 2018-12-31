import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as ca from "actions/ClientActions";

const mapStateToProps = selectorMap({
  startRequestHeight: sel.getTicketsProgressStartRequestHeight,
  ticketsFilter: sel.ticketsFilter,
  currentBlockHeight: sel.currentBlockHeight
});

const mapDispatchToProps = dispatch => bindActionCreators({
  cancelGetTickets: ca.cancelGetTickets,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
