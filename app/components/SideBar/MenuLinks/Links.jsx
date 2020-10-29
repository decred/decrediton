import { FormattedMessage as T } from "react-intl";

export const linkList = [
  {
    path: "/home",
    link: <T id="sidebar.link.home" m="Overview" />,
    icon: "overview",
    ariaLabel: "Overview"
  },
  {
    path: "/transactions",
    link: <T id="sidebar.link.transactions" m="Transactions" />,
    icon: "transactions",
    ariaLabel: "Transactions"
  },
  {
    path: "/governance",
    link: <T id="sidebar.link.governance" m="Governance" />,
    icon: "governance",
    notifProp: "newProposalsStartedVoting",
    ariaLabel: "Governance"
  },
  {
    path: "/tickets",
    link: <T id="sidebar.link.tickets" m="Tickets" />,
    icon: "tickets",
    ariaLabel: "Tickets"
  },
  {
    path: "/accounts",
    link: <T id="sidebar.link.accounts" m="Accounts" />,
    icon: "accounts",
    ariaLabel: "Accounts"
  },
  {
    path: "/privacy",
    link: <T id="sidebar.link.privacy" m="Privacy" />,
    icon: "securitycntr",
    ariaLabel: "Privacy"
  },
  {
    path: "/help",
    link: <T id="sidebar.link.help" m="Help" />,
    icon: "help",
    ariaLabel: "Help"
  },
  {
    path: "/settings",
    link: <T id="sidebar.link.settings" m="Settings" />,
    icon: "settings",
    ariaLabel: "Settings"
  }
];

export const trezorLink = {
  path: "/trezor",
  link: <T id="sidebar.link.trezor" m="Trezor Setup" />,
  icon: "trezor",
  ariaLabel: "Trezor Setup"
};

export const lnLink = {
  path: "/ln",
  link: <T id="sidebar.link.ln" m="Lightning Network" />,
  icon: "ln",
  ariaLabel: "Lightning Network"
};
