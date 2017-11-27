import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as dma from "../actions/DecodeMessageActions";

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  viewedTransaction: sel.viewedTransaction,
  viewedDecodedTransaction: sel.viewedDecodedTransaction,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  decodeRawTransactions: dma.decodeRawTransactions,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
