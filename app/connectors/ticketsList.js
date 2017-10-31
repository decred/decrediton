import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as dma from "../actions/DecodeMessageActions";

const mapStateToProps = selectorMap({
  tickets: sel.viewedTicketListing
});

const mapDispatchToProps = dispatch => bindActionCreators({
  decodeRawTransaction: dma.decodeRawTransaction,
  decodeTicketTransactions: dma.decodeTicketTransactions,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
