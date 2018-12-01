import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as dma from "../actions/DecodeMessageActions";
import * as ca from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  viewedTransaction: sel.viewedTransaction,
  viewedDecodedTransaction: sel.viewedDecodedTransaction,
  tsDate: sel.tsDate,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  decodeRawTransactions: dma.decodeRawTransactions,
  fetchMissingStakeTxData: ca.fetchMissingStakeTxData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
