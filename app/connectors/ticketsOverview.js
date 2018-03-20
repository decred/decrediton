import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  ticketsPerStatus: sel.ticketsPerStatus,
  allTickets: sel.allTickets,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  showTicketList: ca.showTicketList
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
