// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import {
  getTransactionsRequestAttempt,
  getAccountsResponse,
  txPerPage,
  spendableTotalBalance,
  transactions,
  synced,
  unmined,
  homeHistoryMined
} from "../selectors";

const mapStateToProps = selectorMap({
  getTransactionsRequestAttempt,
  getAccountsResponse,
  txPerPage,
  spendableTotalBalance,
  transactions,
  synced,
  unmined,
  mined: homeHistoryMined
});

export default connect(mapStateToProps);
