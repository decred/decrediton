import TransactionContent from "./TransactionContent/TransactionContent";
import TransactionHeader from "./TransactionHeader/TransactionHeader";
import { useParams } from "react-router-dom";
import { DecredLoading } from "indicators";
import { StandalonePage } from "layout";
import { useTransactionPage } from "./hooks";
import styles from "./TransactionPage.module.css";

const Transaction = () => {
  const { txHash } = useParams();
  const {
    abandonTransaction,
    onRevokeTicket,
    publishUnminedTransactions,
    currentBlockHeight,
    state,
    viewedTransaction,
    decodedTx,
    isSPV,
    agendas
  } = useTransactionPage(txHash);

  if (!viewedTransaction) return null;
  switch (state.value) {
    case "idle":
      return <></>;
    case "loading":
      return (
        <StandalonePage
          header={TransactionHeader({ ...viewedTransaction })}
          className={styles.standalonePage}>
          <DecredLoading center />
        </StandalonePage>
      );
    case "success":
      return (
        <StandalonePage
          header={TransactionHeader({ ...viewedTransaction })}
          className={styles.standalonePage}>
          <TransactionContent
            {...{
              transactionDetails: viewedTransaction,
              decodedTransaction: decodedTx,
              abandonTransaction,
              onRevokeTicket,
              publishUnminedTransactions,
              currentBlockHeight,
              isSPV,
              agendas
            }}
          />
        </StandalonePage>
      );
    case "failure":
      return (
        <StandalonePage
          header={TransactionHeader({ ...viewedTransaction })}
          className={styles.standalonePage}>
          <p>Transaction not found</p>
        </StandalonePage>
      );
    default:
      return null;
  }
};

export default Transaction;
