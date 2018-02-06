import { FormattedMessage as T } from "react-intl";

export default {
  transactions: {
    name: <T id="export.transactions.name" m="Transactions"/>,
    description: <T id="export.transactions.descr" m="Exports all transactions recorded in the wallet."/>,
    fields: [
      {name: "time", description: <T id="export.transactions.fields.time" m="Date/time of the transaction" />},
      {name: "hash", description: <T id="export.transactions.fields.hash" m="Hash of the transaction (txid)" />},
      {name: "type", description: <T id="export.transactions.fields.type" m="Detected transaction type (regular, ticket purchase, vote, etc)" />},
      {name: "direction", description: <T id="export.transactions.fields.direction" m="Detected direction of a regular transaction in relation to the wallet (send/receive/transfer)" />},
      {name: "fee", description: <T id="export.transactions.fields.fee" m="Fee payed by the wallet for the transaction" />},
      {name: "amount", description: <T id="export.transactions.fields.amount" m="Net amount sent (including fees) or received by the wallet on this transaction." />},
      {name: "credits", description: <T id="export.transactions.fields.credits" m="Sum of credits (transaction outputs) of the wallet included in this transaction." />},
      {name: "debits", description: <T id="export.transactions.fields.debits" m="Sum of debits (transaction inputs) of the wallet included in this transaction." />},
    ]
  },
  balances: {
    name: <T id="export.balances.name" m="Daily Balances" />,
    description: <T id="export.balances.descr" m="Export the different types of balances, with a daily aggregation." />,
    fields: [
      {name: "time", description: <T id="export.balances.fields.time" m="Date/time that the balance changed" />},
      {name: "spendable", description: <T id="export.balances.fields.spendable" m="Available balance for spending in regular transactions." />},
      {name: "locked", description: <T id="export.balances.fields.locked" m="Balance locked in immature and live tickets." />},
      {name: "total", description: <T id="export.balances.fields.total" m="Total available balance." />},
      {name: "sent", description: <T id="export.balances.fields.sent" m="Total amount sent to addresses not on the wallet." />},
      {name: "received", description: <T id="export.balances.fields.received" m="Total amount received from addresses not on the wallet." />},
    ]
  }
};
