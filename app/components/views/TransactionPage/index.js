import ErrorScreen from "ErrorScreen";
import TransactionPage from "./Page";
import { transactionPage } from "connectors";

const Transaction = ({ walletService, viewedTransaction, routes, router }) => (
  !walletService ? <ErrorScreen /> :
  <TransactionPage
    {...{
      transactionDetails: viewedTransaction,
      routes, router
    }}
  />
);
export default transactionPage(Transaction);
