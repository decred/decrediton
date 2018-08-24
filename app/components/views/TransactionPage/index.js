import ErrorScreen from "ErrorScreen";
import TransactionPage from "./Page";
import { transactionPage } from "connectors";

const Transaction = ({ walletService, viewedTransaction, viewedDecodedTransaction,
  decodeRawTransactions, tsDate }) => {

  if (!viewedDecodedTransaction) {
    decodeRawTransactions([ viewedTransaction.rawTx ]);
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
