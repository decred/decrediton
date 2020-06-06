
import { routing, theming, newProposalCounts } from "connectors";
import { useMenuLinks } from "./hooks";
import { FormattedMessage as T } from "react-intl";

const linkList = [
  {
    path: "/home",
    link: <T id="sidebar.link.home" m="Overview" />,
    icon: "overview"
  },
  {
    path: "/transactions",
    link: <T id="sidebar.link.transactions" m="Transactions" />,
    icon: "transactions"
  },
  {
    path: "/governance",
    link: <T id="sidebar.link.governance" m="Governance" />,
    icon: "governance",
    notifProp: "newProposalsStartedVoting"
  },
  {
    path: "/tickets",
    link: <T id="sidebar.link.tickets" m="Tickets" />,
    icon: "tickets"
  },
  {
    path: "/accounts",
    link: <T id="sidebar.link.accounts" m="Accounts" />,
    icon: "accounts"
  },
  {
    path: "/security",
    link: <T id="activesidebar.link.security" m="Security" />,
    icon: "securitycntr"
  },
  { path: "/help", link: <T id="sidebar.link.help" m="Help" />, icon: "help" },
  {
    path: "/settings",
    link: <T id="sidebar.link.settings" m="Settings" />,
    icon: "settings"
  }
];

// number of link in a row when sidebar is at bottom.
const LINK_PER_ROW = 4;

function MenuLinks({ sidebarOnBottom, location, uiAnimations, isTrezor, lnEnabled, ...props }) {
  const { getAnimatedCaret, getStaticCaret, getLinks } = useMenuLinks(
    sidebarOnBottom,
    location,
    isTrezor,
    lnEnabled,
    linkList,
    LINK_PER_ROW,
    props
  );

  const caret = uiAnimations
    ? getAnimatedCaret
    : getStaticCaret;

  return (
    <>
      {getLinks()}
      {caret}
    </>
  );
}


export default routing(theming(newProposalCounts(MenuLinks)));
