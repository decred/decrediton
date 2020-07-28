import TransactionPage from "./Page";
import Header from "./Header";
import { useParams } from "react-router-dom";
import { DecredLoading } from "indicators";
import { StandalonePage } from "layout";
import { useTransactionPage } from "./hooks";

function Transaction() {
  const { txHash } = useParams();
  const {
    abandonTransaction,
    publishUnminedTransactions,
    currentBlockHeight,
    state,
    viewedTransaction,
    decodedTx
  } = useTransactionPage(txHash);

  switch (state.value) {
    case "idle":
      return <></>;
    case "loading":
      return (
        <StandalonePage
          header={Header({ ...viewedTransaction })}
          className="txdetails-standalone-page">
          <DecredLoading center />
        </StandalonePage>
      );
    case "success":
      return (
        <StandalonePage
          header={Header({ ...viewedTransaction })}
          className="txdetails-standalone-page">
          <TransactionPage
            {...{
              transactionDetails: viewedTransaction,
              decodedTransaction: decodedTx,
              abandonTransaction,
              publishUnminedTransactions,
              currentBlockHeight
            }}
          />
        </StandalonePage>
      );
    case "failure":
      return (
        <StandalonePage
          header={Header({ ...viewedTransaction })}
          className="txdetails-standalone-page">
          <p>Transaction not found</p>
        </StandalonePage>
      );
    default:
      return null;
  }
}

export default Transaction;
