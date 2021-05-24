import { FormattedMessage as T } from "react-intl";

export const LN_KEY = "ln";
export const DEX_KEY = "dex";
export const TREZOR_KEY = "trezor";

export const linkList = [
  {
    path: "/home",
    link: <T id="sidebar.link.home" m="Overview" />,
    type: "overview",
    ariaLabel: "Overview",
    backgroundBusy: false
  },
  {
    path: "/transactions",
    link: <T id="sidebar.link.transactions" m="On-chain Transactions" />,
    type: "transactions",
    ariaLabel: "On-chain Transactions",
    backgroundBusy: false
  },
  {
    path: "/ln",
    link: <T id="sidebar.link.ln" m="Lightning Transactions" />,
    type: LN_KEY,
    ariaLabel: "Lightning Transactions",
    backgroundBusy: false
  },
  {
    path: "/governance",
    link: <T id="sidebar.link.governance" m="Governance" />,
    type: "governance",
    notifProp: "newProposalsStartedVoting",
    ariaLabel: "Governance",
    backgroundBusy: false
  },
  {
    path: "/tickets",
    link: <T id="sidebar.link.staking" m="Staking" />,
    type: "tickets",
    ariaLabel: "Staking",
    backgroundBusy: false
  },
  {
    path: "/privacy",
    link: <T id="sidebar.link.privacy" m="Privacy and Security" />,
    type: "privacy",
    ariaLabel: "Privacy",
    backgroundBusy: false
  },
  {
    path: "/accounts",
    link: <T id="sidebar.link.accounts" m="Accounts" />,
    type: "accounts",
    ariaLabel: "Accounts",
    backgroundBusy: false
  },
  {
    path: "/trezor",
    link: <T id="sidebar.link.trezor" m="Trezor" />,
    type: TREZOR_KEY,
    ariaLabel: "Trezor",
    backgroundBusy: false
  },
  {
    path: "/dex",
    link: <T id="sidebar.link.dex" m="DEX" />,
    type: DEX_KEY,
    ariaLabel: "DEX",
    backgroundBusy: false
  }
];
