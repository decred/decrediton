import { newProposalCounts } from "connectors";
import { useMenuList, useMenuLinks } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import MenuLink from "./MenuLink/MenuLink";

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

const GetMenuLink = ({ linkItem, _nodes, sidebarOnBottom }) => {
  const { path, link, icon, notifProp } = linkItem;
  const hasNotif = notifProp ? true : false;

  return (
    <MenuLink
      icon={icon}
      to={path}
      key={path}
      hasNotification={hasNotif}
      linkRef={(ref) => _nodes.current.set(path, ref)}>
      {!sidebarOnBottom && link}
    </MenuLink>
  );
  };

const MenuList = React.memo(({sidebarOnBottom, _nodes}) => {
  const { linksComponents } = useMenuList(linkList);
  return sidebarOnBottom
    ? linksComponents.map((menuLinks, index) => (
        <div className={"is-row"} key={index}>
          {menuLinks.map((b) => (
            <GetMenuLink {...{ linkItem: b, _nodes, sidebarOnBottom }} />
          ))}
        </div>
      ))
    : linksComponents.map((menuLink) => (
        <GetMenuLink {...{ linkItem: menuLink, _nodes, sidebarOnBottom }} />
      ));
});

const MenuLinks = () => {
  const {
    sidebarOnBottom,
    uiAnimations,
    getAnimatedCaret,
    getStaticCaret,
    _nodes
  } = useMenuLinks();

  return (
    <>
      <MenuList {...{ sidebarOnBottom, _nodes }} />
      {uiAnimations ? getAnimatedCaret : getStaticCaret}
    </>
  );
};

export default newProposalCounts(MenuLinks);
