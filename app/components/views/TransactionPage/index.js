import ErrorScreen from "ErrorScreen";
import TransactionPage from "./Page";
import { transactionPage } from "connectors";

const Transaction = ({ walletService, viewedTransaction, viewedDecodedTransaction,
  routes, router, decodeRawTransactions }) => {

  if (!viewedDecodedTransaction) {
    decodeRawTransactions([viewedTransaction.rawTx]);
  }

  return !walletService
    ? <ErrorScreen />
    : <TransactionPage
      {...{
        transactionDetails: viewedTransaction,
        decodedTransaction: viewedDecodedTransaction,
        routes, router,
      }}
    />;
};
export default transactionPage(Transaction);
