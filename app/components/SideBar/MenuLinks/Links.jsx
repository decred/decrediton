import { FormattedMessage as T } from "react-intl";

export const LN_KEY = "ln";
export const TREZOR_KEY = "trezor";

export const linkList = [
  {
    path: "/home",
    link: <T id="sidebar.link.home" m="Overview" />,
    icon: "overview",
    ariaLabel: "Overview"
  },
  {
    path: "/transactions",
    link: <T id="sidebar.link.transactions" m="On-chain Transactions" />,
    icon: "transactions",
    ariaLabel: "Transactions"
  },
  {
    path: "/ln",
    link: <T id="sidebar.link.ln" m="Lightning Transactions" />,
    icon: LN_KEY,
    key: LN_KEY,
    ariaLabel: "Lightning Network"
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
    link: <T id="sidebar.link.tickets" m="Staking" />,
    icon: "tickets",
    ariaLabel: "Tickets"
  },
  {
    path: "/privacy",
    link: <T id="sidebar.link.privacy" m="Privacy and Security" />,
    icon: "securitycntr",
    ariaLabel: "Privacy"
  },
  {
    path: "/accounts",
    link: <T id="sidebar.link.accounts" m="Accounts" />,
    icon: "accounts",
    ariaLabel: "Accounts"
  },
  {
    path: "/trezor",
    link: <T id="sidebar.link.trezor" m="Trezor" />,
    icon: TREZOR_KEY,
    key: TREZOR_KEY,
    ariaLabel: "Trezor"
  }
];
