import { classNames, Tabs, Tab, Tooltip } from "pi-ui";
import { useMenuLinks } from "./hooks";
import styles from "./MenuLinks.module.css";
import { MENU_LINKS_PER_ROW } from "constants/Decrediton";

const MenuLinks = () => {
  const {
    sidebarOnBottom,
    menuLinks,
    expandSideBar,
    activeTabIndex,
    onSelectTab
  } = useMenuLinks();

  return (
    <>
      <Tabs
        onSelectTab={onSelectTab}
        activeTabIndex={activeTabIndex}
        mode={sidebarOnBottom ? "horizontal" : "vertical"}
        className={classNames(
          styles.tabs,
          expandSideBar && styles.expanded,
          sidebarOnBottom && styles.onBottom
        )}>
        {menuLinks.map((menuLink, index) => {
          const menuLinkLabel = (text) => (
            <div
              className={styles.menuLinkLabel}
              data-testid={`menuLinkLabel-${menuLink.icon}`}>
              {text}
            </div>
          );
          const label =
            expandSideBar && !sidebarOnBottom ? (
              menuLinkLabel(menuLink.link)
            ) : (
              <Tooltip
                content={menuLink.link}
                placement={sidebarOnBottom ? "top" : "right"}>
                {menuLinkLabel()}
              </Tooltip>
            );
          return (
            (index < MENU_LINKS_PER_ROW ||
              expandSideBar ||
              !sidebarOnBottom) && (
              <Tab
                label={label}
                key={menuLink.path}
                className={classNames(
                  styles.tab,
                  styles[`${menuLink.icon}Icon`],
                  expandSideBar && styles.expanded,
                  sidebarOnBottom && styles.onBottom,
                  menuLink.notifProp && styles.notificationIcon
                )}
              />
            )
          );
        })}
      </Tabs>
    </>
  );
};

export default MenuLinks;
