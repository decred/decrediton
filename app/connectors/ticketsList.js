import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as dma from "../actions/DecodeMessageActions";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  tickets: sel.viewedTicketListing
});

const mapDispatchToProps = dispatch => bindActionCreators({
  decodeRawTransactions: dma.decodeRawTransactions,
  goBackHistory: ca.goBackHistory,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
