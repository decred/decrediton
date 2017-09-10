// @flow
import React, { Component } from "react";
import History from "./History";
import { TransactionDetails }  from "../../middleware/walletrpc/api_pb";
import { reverseHash } from "../../helpers/byteActions";

const getTypeStr = type => ({
  [TransactionDetails.TransactionType.TICKET_PURCHASE]: "Ticket",
  [TransactionDetails.TransactionType.VOTE]: "Vote",
  [TransactionDetails.TransactionType.REVOCATION]: "Revocation"
})[type];

class TxHistory extends Component {
  render() {
    const { showTxDetail } = this.props;
    const unmined = this.flattenTxs(this.props.unmined);
    const mined = this.flattenTxs(this.props.mined);
    return <History {...{ showTxDetail, unmined, mined }} />;
  }

  flattenTxs(txs = []) {
    const { getAccountsResponse, network } = this.props;
    const accounts = getAccountsResponse ? getAccountsResponse.getAccountsList() : [];
    const findAccount = num => accounts.find(account => account.getAccountNumber() === num);
    const getAccountName = num => (act => act ? act.getAccountName() : "")(findAccount(num));
    return txs
      .map(tx => {
        const { blockHash } = tx;
        const type = tx.type || null;
        let txInfo = tx.tx ? tx : {};
        let timestamp = tx.timestamp;
        tx = tx.tx || tx;
        timestamp = timestamp || tx.timestamp;
        let totalFundsReceived = 0;
        let totalChange = 0;
        let addressStr = [];
        let debitedAccount;
        let creditedAccount;
        const txInputs = [];
        const txOutputs = [];
        const txHash = reverseHash(Buffer.from(tx.getHash()).toString("hex"));
        const txBlockHash = reverseHash(Buffer.from(blockHash).toString("hex"));
        const fee = tx.getFee();
        const totalDebit = tx.getDebitsList().reduce((total, debit) => {
          const accountName = getAccountName(debit.getPreviousAccount());
          const amount = debit.getPreviousAmount();
          txInputs.push({ accountName, amount });
          return total + amount;
        }, 0);

        tx.getCreditsList().forEach((credit) => {
          const amount = credit.getAmount();
          const address = credit.getAddress();
          addressStr.push(address);
          creditedAccount = credit.getAccount();
          const accountName = getAccountName(creditedAccount);
          txOutputs.push({ accountName, amount, address });
          credit.getInternal() ? (totalChange += amount) : (totalFundsReceived += amount);
        });

        const shared = {
          txUrl: `https://${network}.decred.org/tx/${txHash}`,
          txBlockUrl: `https://${network}.decred.org/block/${txBlockHash}`,
          txHash,
          txHeight: txInfo.height,
          txType: getTypeStr(type),
          txTimestamp: timestamp,
          txFee: fee,
          txInputs,
          txOutputs,
          txBlockHash,
          type,
          tx,
          blockHash,
          txInfo
        };

        const txDetails = ((totalFundsReceived + totalChange + fee) < totalDebit)
          ? {
            txDescription: { direction: "Sent", addressStr: null },
            txAmount: totalDebit - fee - totalChange - totalFundsReceived,
            direction: "out",
            accountName: getAccountName(debitedAccount)
          }
          : ((totalFundsReceived + totalChange + fee) === totalDebit)
            ? {
              txDescription: { direction: "Transferred", addressStr },
              txAmount: fee,
              direction: "transfer",
              accountName: getAccountName(creditedAccount)
            }
            : {
              txDescription: { direction: "Received at:", addressStr },
              txAmount: totalFundsReceived,
              direction: "in",
              accountName: getAccountName(creditedAccount)
            };

        // XXX: This is still working around some legacy lameness with the tx history/detail components
        txInfo = { ...txInfo, ...shared, ...txDetails };
        return { ...shared, ...txDetails, txInfo };
      })
      .sort((a, b) => b.txTimestamp - a.txTimestamp);
  }
}

export default TxHistory;
