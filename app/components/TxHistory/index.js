// @flow
import React, { Component } from "react";
import History from "./History";

class TxHistory extends Component {
  render() {
    const { showTxDetail } = this.props;
    const unmined = this.flattenTxs(this.props.unmined);
    const mined = this.flattenTxs(this.props.mined);
    return <History {...{ showTxDetail, unmined, mined }} />;
  }

  flattenTxs(txs = []) {
    const { getAccountsResponse } = this.props;
    const accounts = getAccountsResponse ? getAccountsResponse.getAccountsList() : [];
    const findAccount = num => accounts.find(account => account.getAccountNumber() === num);
    const getAccountName = num => (act => act ? act.getAccountName() : "")(findAccount(num));
    return txs
      .map(tx => {
        const { type, blockHash } = tx;
        const txInfo = tx.tx ? tx : {};
        let timestamp = tx.timestamp;
        tx = tx.tx || tx;
        timestamp = timestamp || tx.timestamp;
        let totalFundsReceived = 0;
        let totalChange = 0;
        let addressStr = [];
        let debitedAccount;
        let creditedAccount;
        const txHash = Buffer.from(tx.getHash()).toString("hex");
        const fee = tx.getFee();
        const totalDebit = tx.getDebitsList().reduce((total, debit) => {
          debitedAccount = debit.getPreviousAccount();
          return total + debit.getPreviousAmount();
        }, 0);

        tx.getCreditsList().forEach((credit) => {
          const amount = credit.getAmount();
          addressStr.push(credit.getAddress());
          creditedAccount = credit.getAccount();
          credit.getInternal() ? (totalChange += amount) : (totalFundsReceived += amount);
        });

        return ((totalFundsReceived + totalChange + fee) < totalDebit)
          ? {
            txHash, timestamp, type, tx, blockHash, txInfo,
            txDescription: { direction: "Sent", addressStr: null },
            txAmount: totalDebit - fee - totalChange - totalFundsReceived,
            direction: "out",
            accountName: getAccountName(debitedAccount)
          }
          : ((totalFundsReceived + totalChange + fee) === totalDebit)
            ? {
              txHash, timestamp, type, tx, blockHash, txInfo,
              txDescription: { direction: "Transferred", addressStr },
              txAmount: fee,
              direction: "transfer",
              accountName: getAccountName(creditedAccount)
            }
            : {
              txHash, timestamp, type, tx, blockHash, txInfo,
              txDescription: { direction: "Received at:", addressStr },
              txAmount: totalFundsReceived,
              direction: "in",
              accountName: getAccountName(creditedAccount)
            };
      })
      .sort((a, b) => b.timestamp - a.timestamp);
  }
}

export default TxHistory;
