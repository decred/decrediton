import { linkList } from "./Links";
import { Motion } from "react-motion";
import MenuLink from "./MenuLink/MenuLink";
import style from "../SideBar.module.css";
import { useMenuLinks } from "./hooks";

const MenuListLinks = ({ menuLinks, nodes, sidebarOnBottom, expandSideBar }) =>
  menuLinks.map((menuLink) => {
    const { path, link, icon, notifProp, ariaLabel } = menuLink;
    return (
      <MenuLink
        path={path}
        link={link}
        icon={icon}
        notifProp={notifProp}
        ariaLabel={ariaLabel}
        ref={(ref) => nodes.set(path, ref)}
        sidebarOnBottom={sidebarOnBottom}
        key={path}
        expandSideBar={expandSideBar}
      />
    );
  });

const MenuList = React.memo(
  ({ sidebarOnBottom, nodes, menuLinks, expandSideBar }) =>
    sidebarOnBottom ? (
      menuLinks.map((menuLinkRow, index) => (
        <div className={style.isRow} key={index}>
          <MenuListLinks
            menuLinks={menuLinkRow}
            nodes={nodes}
            sidebarOnBottom={sidebarOnBottom}
            expandSideBar={expandSideBar}
          />
        </div>
      ))
    ) : (
      <MenuListLinks
        menuLinks={menuLinks}
        nodes={nodes}
        sidebarOnBottom={sidebarOnBottom}
        expandSideBar={expandSideBar}
      />
    )
);

const MenuLinks = () => {
  const {
    sidebarOnBottom,
    uiAnimations,
    caretStyle,
    nodes,
    menuLinks,
    expandSideBar
  } = useMenuLinks(linkList);

  return (
    <>
      <MenuList {...{ sidebarOnBottom, nodes, menuLinks, expandSideBar }} />
      {uiAnimations ? (
        <Motion style={caretStyle}>
          {(caretStyle) => (
            <div className={style.menuCaret} style={caretStyle} />
          )}
        </Motion>
      ) : (
        <div className={style.menuCaret} style={caretStyle} />
      )}
    </>
  );
};

export default MenuLinks;
