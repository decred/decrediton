import { newProposalCounts } from "connectors";
import { useMenuLinks } from "./hooks";
import MenuLink from "./MenuLink/MenuLink";
import { Motion } from "react-motion";
import style from "../SideBar.module.css";
import { linkList } from "./Links";

const MenuList = React.memo(({ sidebarOnBottom, nodes, menuLinks }) =>
  sidebarOnBottom
    ? menuLinks.map((menuLinkRow, index) => (
        <div className={"is-row"} key={index}>
          {menuLinkRow.map((menuLink) => {
            const { path, link, icon, notifProp } = menuLink;
            return (
              <MenuLink
                path={path}
                link={link}
                icon={icon}
                notifProp={notifProp}
                ref={(ref) => nodes.set(path, ref)}
                sidebarOnBottom={sidebarOnBottom}
              />
            );
          })}
        </div>
      ))
    : menuLinks.map((menuLink) => {
        const { path, link, icon, notifProp } = menuLink;
        return (
          <MenuLink
            path={path}
            link={link}
            icon={icon}
            notifProp={notifProp}
            ref={(ref) => nodes.set(path, ref)}
            sidebarOnBottom={sidebarOnBottom}
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
