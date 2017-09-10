// @flow
import { connect } from "react-redux";
import HistoryPage from "../components/views/HistoryPage";
import { selectorMap } from "../fp";
import {
  network,
  walletService,
  txPerPage,
  spendableTotalBalance,
  getBalanceRequestAttempt,
  transactions,
  transactionDetails,
  getAccountsResponse,
  getNetworkResponse
} from "../selectors";

const mapStateToProps = selectorMap({
  walletService,
  network,
  txPerPage,
  spendableTotalBalance,
  getBalanceRequestAttempt,
  transactions,
  transactionDetails,
  getAccountsResponse,
  getNetworkResponse
});

export default connect(mapStateToProps)(HistoryPage);
