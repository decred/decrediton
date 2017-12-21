import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as dma from "../actions/DecodeMessageActions";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  tickets: sel.tickets,
  noMoreTickets: sel.noMoreTickets,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  decodeRawTicketTransactions: ca.decodeRawTicketTransactions,
  getTickets: ca.getTickets,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
