import { defineMessages } from "react-intl";

export default defineMessages({
  "accounts.title":                   { id: "accounts.title",              defaultMessage: "Accounts" },
  "history.title":                    { id: "history.title",               defaultMessage: "Available Balance" },

  "tickets.title":                    { id: "tickets.title",               defaultMessage: "Tickets" },
  "tickets.tab.purchase":             { id: "tickets.tab.purchase",        defaultMessage: "Purchase Tickets" },
  "tickets.tab.mytickets":            { id: "tickets.tab.mytickets",       defaultMessage: "My Tickets" },
  "tickets.tab.governance":           { id: "tickets.tab.governance",      defaultMessage: "Governance" },
  "tickets.tab.statistics":           { id: "tickets.tab.statistics",      defaultMessage: "Statistics" },

  "transactions.title":               { id: "transactions.title",               defaultMessage: "Transactions" },
  "transactions.description.testnet": { id: "transactions.description.testnet", defaultMessage: "Testnet Decred addresses always begin with letter T and contain 26-35 alphanumeric characters (e.g. TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0)." },
  "transactions.description.mainnet": { id: "transactions.description.mainnet", defaultMessage: "Mainnet Decred addresses always begin with letter D and contain 26-35 alphanumeric characters (e.g. DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X)." },
  "transactions.tab.send":            { id: "transactions.tab.send",            defaultMessage: "Send" },
  "transactions.tab.receive":         { id: "transactions.tab.receive",         defaultMessage: "Receive" },
  "transactions.tab.history":         { id: "transactions.tab.history",         defaultMessage: "History" },

  "security.title":                   { id: "security.title",                   defaultMessage: "Security Center" },
  "security.tab.sign":                { id: "security.tab.sign",                defaultMessage: "Sign Message" },
  "security.tab.verify":              { id: "security.tab.verify",              defaultMessage: "Verify Message" },

  "settings.title":                   { id: "settings.title",              defaultMessage: "Settings" },
});
