import { connect } from "react-redux";
import { selectorMap, substruct } from "../fp";
import * as selectors from "../selectors";

const mapStateToProps = selectorMap({
  ...substruct({
    walletService: null,
    network: null,
    txPerPage: null,
    spendableTotalBalance: null,
    getBalanceRequestAttempt: null,
    transactions: null,
    transactionDetails: null,
    getAccountsResponse: null,
    getNetworkResponse: null
  }, selectors)
});

export default connect(mapStateToProps);
