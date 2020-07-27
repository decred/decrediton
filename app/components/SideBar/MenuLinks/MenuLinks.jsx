import { linkList } from "./Links";
import { Motion } from "react-motion";
import MenuLink from "./MenuLink/MenuLink";
import style from "../SideBar.module.css";
import { useMenuLinks } from "./hooks";

const MenuList = React.memo(
  ({ sidebarOnBottom, nodes, menuLinks, expandSideBar }) =>
    sidebarOnBottom
      ? menuLinks.map((menuLinkRow, index) => (
          <div className={style.isRow} key={index}>
            {menuLinkRow.map((menuLink) => {
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
            })}
          </div>
        ))
      : menuLinks.map((menuLink) => {
          const { path, link, icon, notifProp, ariaLabel } = menuLink;
          return (
            <Tooltip
              content={
                <T
                  id="autobuyer.enabled"
                  m="{value}"
                  values={{ value: link }}
                />
              }>
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
            </Tooltip>
          );
        })
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
