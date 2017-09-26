import React from "react";
import ErrorScreen from "../../ErrorScreen";
import TransactionPage from "./Page";
import transactionPageConnector from "../../../connectors/transactionPage";

const Transaction = ({ walletService, viewedTransaction }) => (!walletService ? <ErrorScreen /> : (
  <TransactionPage
    {...{
      transactionDetails: viewedTransaction,
    }}
  />
));
export default transactionPageConnector(Transaction);
