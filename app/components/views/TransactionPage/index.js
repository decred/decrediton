import ErrorScreen from "ErrorScreen";
import TransactionPage from "./Page";
import { transactionPage } from "connectors";

const Transaction = ({ walletService, viewedTransaction, viewedDecodedTransaction,
  decodeRawTransactions, tsDate, fetchMissingStakeTxData }) => {

  if (!viewedDecodedTransaction) {
    decodeRawTransactions([ viewedTransaction.rawTx ]);
  }

  const { txType, ticketPrice, leaveTimestamp } = viewedTransaction;
  if (((txType == "Ticket") && (!ticketPrice)) || ((txType == "Vote") && (!leaveTimestamp))) {
    // don't have the extended stake info for this transaction yet. Request it.
    fetchMissingStakeTxData(viewedTransaction);
  }

  return !walletService
    ? <ErrorScreen />
    : <TransactionPage
      {...{
        transactionDetails: viewedTransaction,
        decodedTransaction: viewedDecodedTransaction,
        tsDate: tsDate,
      }}
    />;
};
export default transactionPage(Transaction);
