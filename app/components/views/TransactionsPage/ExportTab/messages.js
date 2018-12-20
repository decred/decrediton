import { FormattedMessage as T } from "react-intl";

export default {
  transactions: {
    name: <T id="export.transactions.name" m="Transactions"/>,
    description: <T id="export.transactions.descr" m="Exports all transactions recorded in the wallet."/>,
    fields: [
      { name: "time", description: <T id="export.transactions.fields.time" m="Date/time of the transaction" /> },
      { name: "hash", description: <T id="export.transactions.fields.hash" m="Hash of the transaction (txid)" /> },
      { name: "type", description: <T id="export.transactions.fields.type" m="Detected transaction type (regular, ticket purchase, vote, etc)" /> },
      { name: "direction", description: <T id="export.transactions.fields.direction" m="Detected direction of a regular transaction in relation to the wallet (send/receive/transfer)" /> },
      { name: "fee", description: <T id="export.transactions.fields.fee" m="Fee paid by the wallet for the transaction" /> },
      { name: "amount", description: <T id="export.transactions.fields.amount" m="Net amount sent (including fees) or received by the wallet on this transaction." /> },
      { name: "credits", description: <T id="export.transactions.fields.credits" m="Sum of credits (transaction outputs) of the wallet included in this transaction." /> },
      { name: "debits", description: <T id="export.transactions.fields.debits" m="Sum of debits (transaction inputs) of the wallet included in this transaction." /> },
    ]
  },
  dailyBalances: {
    name: <T id="export.dailyBalances.name" m="Daily Balances" />,
    description: <T id="export.dailyBalances.descr" m="Export the different types of balances, with a daily aggregation." />,
    fields: [
      { name: "time", description: <T id="export.dailyBalances.fields.time" m="Date of the balance. The time part is always fixed as the last second of the day (to represent the balance at the end of that day)." /> },
      { name: "spendable", description: <T id="export.dailyBalances.fields.spendable" m="Available balance for spending in regular transactions." /> },
      { name: "immature", description: <T id="export.dailyBalances.fields.immature" m="Balance locked in immature tickets." /> },
      { name: "locked", description: <T id="export.dailyBalances.fields.locked" m="Balance locked in immature and live tickets." /> },
      { name: "immatureNonWallet", description: <T id="export.dailyBalances.fields.immatureNonWallet" m="Balance locked in immature tickets not controlled by the wallet." /> },
      { name: "lockedNonWallet", description: <T id="export.balances.fields.lockedNonWallet" m="Balance locked in live tickets not controlled by the wallet." /> },
      { name: "total", description: <T id="export.dailyBalances.fields.total" m="Total available balance." /> },
      { name: "stakeRewards", description: <T id="export.balances.fields.stakeRewards" m="Total stake rewards received." /> },
      { name: "stakeFees", description: <T id="export.balances.fields.stakeFees" m="Total stake fees paid." /> },
      { name: "totalStake", description: <T id="export.balances.fields.totalStake" m="Total amount of DCR used on staking." /> },
      { name: "sent", description: <T id="export.dailyBalances.fields.sent" m="Total amount sent to addresses not on the wallet." /> },
      { name: "received", description: <T id="export.dailyBalances.fields.received" m="Total amount received from addresses not on the wallet." /> },
      { name: "voted", description: <T id="export.dailyBalances.fields.voted" m="Total amount, in DCR, of tickets voted" /> },
      { name: "revoked", description: <T id="export.dailyBalances.fields.revoked" m="Total amount, in DCR, of tickets revoked" /> },
      { name: "ticket", description: <T id="export.dailyBalances.fields.ticket" m="Total amount, in DCR, spent in tickets" /> },
    ]
  },
  balances: {
    name: <T id="export.balances.name" m="Balances" />,
    description: <T id="export.balances.descr" m="Export the different types of balances after each event that changes it." />,
    fields: [
      { name: "time", description: <T id="export.balances.fields.time" m="Date/time that the balance changed" /> },
      { name: "spendable", description: <T id="export.balances.fields.spendable" m="Available balance for spending in regular transactions." /> },
      { name: "locked", description: <T id="export.balances.fields.locked" m="Balance locked in live tickets." /> },
      { name: "immature", description: <T id="export.dailyBalances.fields.immature" m="Balance locked in immature tickets." /> },
      { name: "lockedNonWallet", description: <T id="export.balances.fields.lockedNonWallet" m="Balance locked in live tickets not controlled by the wallet." /> },
      { name: "immatureNonWallet", description: <T id="export.dailyBalances.fields.immatureNonWallet" m="Balance locked in immature tickets not controlled by the wallet." /> },
      { name: "total", description: <T id="export.balances.fields.total" m="Total available balance." /> },
      { name: "stakeRewards", description: <T id="export.balances.fields.stakeRewards" m="Total stake rewards received." /> },
      { name: "stakeFees", description: <T id="export.balances.fields.stakeFees" m="Total stake fees paid." /> },
      { name: "totalStake", description: <T id="export.balances.fields.totalStake" m="Total amount of DCR used on staking." /> },
    ]
  },
  voteTime: {
    name: <T id="export.votetime.name" m="Vote Time" />,
    description: <T id="export.votetime.descr" m="Export a time-to-vote histogram in days (how many days from ticket purchase until the ticket was selected for voting)." />,
    fields: [
      { name: "daysToVote", description: <T id="export.votettime.fields.daysToVote" m="Day bucket" /> },
      { name: "count", description: <T id="export.votetime.fields.count" m="How many tickets voted in this day bucket" /> },
    ]
  },
  tickets: {
    name: <T id="export.tickets.name" m="Tickets" />,
    description: <T id="export.tickets.descr" m="Export ticket and vote information." />,
    fields: [
      { name: "spenderTimestamp", description: <T id="export.tickets.fields.spenderTimestamp" m="Date/Time of vote/revocation." /> },
      { name: "status", description: <T id="export.tickets.fields.status" m="Latest status for the ticket (live, voted, missed, revoked)." /> },
      { name: "ticketHash", description: <T id="export.tickets.fields.ticketStatus" m="Txid of the ticket transaction." /> },
      { name: "spenderHash", description: <T id="export.tickets.fields.spenderHash" m="Txid of the spender (vote/revocation) transaction." /> },
      { name: "sentAmount", description: <T id="export.tickets.fields.sentAmount" m="Amount sent by the wallet into the ticket transaction." /> },
      { name: "returnedAmount", description: <T id="export.tickets.fields.returnedAmount" m="Amount returned to the wallet by the spender (vote/revocation) transaction." /> },
    ]
  }
};
