import { useMenuList, useMenuLinks } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import MenuLink from "./MenuLink";

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

const MenuListA = () => {
  const {
    numberOfRows,
    totalLinks,
    LINK_PER_ROW,
    sidebarOnBottom,
    links
  } = useMenuList(linkList);

  let linksComponent = [];
  if (sidebarOnBottom) {
    let n = 0;
    for (let i = 0; i < numberOfRows && n < totalLinks; i++) {
      linksComponent[i] = [];
      for (let j = 0; j < LINK_PER_ROW.current && n < totalLinks; j++) {
        linksComponent[i].push(links.current[n]);
        n++;
      }
      // linksComponent[i] = h(
      //   "div",
      //   { className: "is-row", key: i },
      //   linksComponent[i]
      // );
    }
    return linksComponent;
  }

  return (linksComponent = links.current.map((link) => link));
};

const MenuList = () => {
  const a = MenuListA();
  const { _nodes, sidebarOnBottom } = useMenuLinks();
  return sidebarOnBottom
    ? a.map((menuLinks, index) => (
        <div className={"is-row"}  key={index} >
          {menuLinks.map((b) => (
            <GetMenuLink {...{ linkItem: b, _nodes, sidebarOnBottom }} />
          ))}
        </div>
      ))
    : a.map((menuLink) => <GetMenuLink {...{ linkItem: menuLink, _nodes, sidebarOnBottom }} />);
};

export default MenuList;
