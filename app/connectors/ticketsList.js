import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  tickets: sel.tickets,
  noMoreTickets: sel.noMoreTickets,
  ticketsFilter: sel.ticketsFilter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  decodeRawTicketTransactions: ca.decodeRawTicketTransactions,
  getTickets: ca.getTickets,
  changeTicketsFilter: ca.changeTicketsFilter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
