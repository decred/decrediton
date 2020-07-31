import { linkList } from "./Links";
import { Motion } from "react-motion";
import MenuLink from "./MenuLink/MenuLink";
import style from "../SideBar.module.css";
import { useMenuLinks } from "./hooks";

const MenuList = React.memo(({ sidebarOnBottom, nodes, menuLinks }) =>
  sidebarOnBottom
    ? menuLinks.map((menuLinkRow, index) => (
        <div className={"is-row"} key={index}>
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
              />
            );
          })}
        </div>
      ))
    : menuLinks.map((menuLink) => {
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
          />
        );
      })
);

const MenuLinks = () => {
  const {
    sidebarOnBottom,
    uiAnimations,
    caretStyle,
    nodes,
    menuLinks
  } = useMenuLinks(linkList);

  return (
    <>
      <MenuList {...{ sidebarOnBottom, nodes, menuLinks }} />
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
