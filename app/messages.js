import { defineMessages } from "react-intl";

export default defineMessages({
  "home.title":                               { id: "home.title",                            defaultMessage: "home" },
  "home.tab.balance":                         { id: "home.tab.balance",                      defaultMessage: "Balance" },
  "home.tab.tickets":                         { id: "home.tab.tickets",                      defaultMessage: "Ticket" },
  "home.tab.transactions":                    { id: "home.tab.transactions",                 defaultMessage: "Transactions" },

  "accounts.title":                           { id: "accounts.title",                        defaultMessage: "Accounts" },
  "accounts.description":                     { id: "accounts.description",                  defaultMessage: "Accounts allow you to keep separate records of your Hx funds.\nTransferring Hx across accounts will create a transaction on the blockchain." },

  "transaction.description":                  { id: "transaction.description",               defaultMessage: "Date and time will appear as soon as we get a confirmation." },

  "transactions.title":                       { id: "transactions.title",                    defaultMessage: "Transactions" },
  "transactions.description.send.testnet":    { id: "transactions.description.send.testnet", defaultMessage: "Testnet Decred addresses always begin with letter T and contain 26-35 alphanumeric characters\n(e.g. TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0)." },
  "transactions.description.send.mainnet":    { id: "transactions.description.send.mainnet", defaultMessage: "Mainnet Decred addresses always begin with letter D and contain 26-35 alphanumeric characters\n(e.g. DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X)." },
  "transactions.description.receive":         { id: "transactions.description.receive",      defaultMessage: "Each time you request a payment, create a new address to protect your privacy." },
  "transactions.description.history":         { id: "transactions.description.history",      defaultMessage: "Total Balance:" },
  "transactions.tab.send":                    { id: "transactions.tab.send",                 defaultMessage: "Send" },
  "transactions.tab.receive":                 { id: "transactions.tab.receive",              defaultMessage: "Receive" },
  "transactions.tab.history":                 { id: "transactions.tab.history",              defaultMessage: "History" },

  "tickets.title":                            { id: "tickets.title",                         defaultMessage: "Tickets" },
  "tickets.description":                      { id: "tickets.description",                   defaultMessage: "Current Price:" },
  "tickets.tab.purchase":                     { id: "tickets.tab.purchase",                  defaultMessage: "Purchase Tickets" },
  "tickets.tab.mytickets":                    { id: "tickets.tab.mytickets",                 defaultMessage: "My Tickets" },
  "tickets.tab.governance":                   { id: "tickets.tab.governance",                defaultMessage: "Governance" },
  "tickets.tab.statistics":                   { id: "tickets.tab.statistics",                defaultMessage: "Statistics" },

  "security.title":                           { id: "security.title",                        defaultMessage: "Security Center" },
  "security.description":                     { id: "security.description",                  defaultMessage: "Various tools that help in different aspects of crypto currency security will be located here." },
  "security.tab.sign":                        { id: "security.tab.sign",                     defaultMessage: "Sign Message" },
  "security.tab.verify":                      { id: "security.tab.verify",                   defaultMessage: "Verify Message" },
  "security.tab.validate":                    { id: "security.tab.validate",                 defaultMessage: "Validate Address" },

  "settings.title":                           { id: "settings.title",                        defaultMessage: "Settings" },
  "settings.description":                     { id: "settings.description",                  defaultMessage: "Changing network settings requires a restart" },

  "help.title":                               { id: "help.title",                            defaultMessage: "Help" },
  "help.tab.links":                           { id: "help.tab.links",                        defaultMessage: "Links" },
  "help.description.links":                   { id: "help.description.links",                defaultMessage: "If you have any difficulty with Hxify, please use the following links to help find a solution." },
  "help.tab.logs":                            { id: "help.tab.logs",                         defaultMessage: "View Logs" },
  "help.description.logs":                    { id: "help.description.logs",                 defaultMessage: "Please find your current logs below to look for any issue or error you are having." },


  "error.title":                              { id: "error.title",                           defaultMessage: "An error has occured" },
  "walletError.title":                        { id: "walletError.title",                     defaultMessage: "An error has occured" },
  "invalidRPCVersion.title":                  { id: "invalidRPCVersion.title",               defaultMessage: "Invalid RPC Version" },

  "menu.home":                                { id: "menu.home",                             defaultMessage: "Overview"},
  "menu.accounts":                            { id: "menu.accounts",                         defaultMessage: "Accounts"},
  "menu.transactions":                        { id: "menu.transactions",                     defaultMessage: "Transactions"},
  "menu.tickets":                             { id: "menu.tickets",                          defaultMessage: "Tickets"},
  "menu.security":                            { id: "menu.security",                         defaultMessage: "Security Center"},
  "menu.settings":                            { id: "menu.settings",                         defaultMessage: "Settings"},
  "menu.help":                                { id: "menu.help",                             defaultMessage: "Help"},
});
