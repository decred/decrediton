import { newProposalCounts } from "connectors";
import { useMenuList, useMenuLinks } from "./hooks";
import MenuLink from "./MenuLink/MenuLink";
import { linkList } from "./Links";
import { Motion } from "react-motion";
import style from "../SideBar.module.css";

const StandardMenuLink = ({ linkItem, sidebarOnBottom }) => {
  const { _nodes } = useMenuLinks();

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

const MenuList = React.memo(({ sidebarOnBottom }) => {
  const { linksComponents } = useMenuList(linkList);

  return sidebarOnBottom
    ? linksComponents.map((menuLinks, index) => (
        <div className={"is-row"} key={index}>
          {menuLinks.map((b) => (
            <StandardMenuLink {...{ linkItem: b, sidebarOnBottom }} />
          ))}
        </div>
      ))
    : linksComponents.map((menuLink) => (
        <StandardMenuLink {...{ linkItem: menuLink, sidebarOnBottom }} />
      ));
});

const MenuLinks = () => {
  const { sidebarOnBottom, uiAnimations, caretStyle } = useMenuLinks();

  return (
    <>
      <MenuList {...{ sidebarOnBottom }} />
      {uiAnimations ? (
        <Motion style={caretStyle}>
          {(caretStyle) => <div className={style.menuCaret} {...{ caretStyle }} />}
        </Motion>
      ) : (
        <div className={style.menuCaret} style={caretStyle} />
      )}
    </>
  );
};

export default newProposalCounts(MenuLinks);
