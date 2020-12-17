import TransactionPage from "./Page";
import Header from "./Header";
import { useParams } from "react-router-dom";
import { DecredLoading } from "indicators";
import { StandalonePage } from "layout";
import { useTransactionPage } from "./hooks";
import { useState } from "react";

function Transaction() {
  const { txHash } = useParams();
  const {
    abandonTransaction,
    publishUnminedTransactions,
    currentBlockHeight,
    state,
    viewedTransaction,
    decodedTx,
    syncVSPTicketByHash,
    defaultSpendingAccount,
    hasVSPTicketsError
  } = useTransactionPage(txHash);

  const [account, setAccount] = useState(defaultSpendingAccount);
  const [vsp, setVSP] = useState(null);

  const onSyncVSPTicketByHash = (passphrase) => {
    syncVSPTicketByHash({
      passphrase,
      account: account.value,
      vspHost: vsp.host,
      vspPubkey: vsp.pubkey,
      ticketHash: txHash
    });
  };

  if (!viewedTransaction) return null;
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
              currentBlockHeight,
              onSyncVSPTicketByHash,
              setVSP,
              account,
              setAccount,
              hasVSPTicketsError
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
