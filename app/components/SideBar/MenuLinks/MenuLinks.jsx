import { classNames, Tabs, Tab, Tooltip } from "pi-ui";
import { useMenuLinks } from "./hooks";
import styles from "./MenuLinks.module.css";
import { MENU_LINKS_PER_ROW } from "constants/decrediton";

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
        {menuLinks.map(
          ({ type, link, path, notifProp, backgroundBusy }, index) => {
            const menuLinkLabel = (text) => (
              <div
                className={styles.menuLinkLabel}
                data-testid={`menuLinkLabel-${type}`}>
                {text}
              </div>
            );
            const label =
              expandSideBar && !sidebarOnBottom ? (
                menuLinkLabel(link)
              ) : (
                <Tooltip
                  content={link}
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
                  key={path}
                  className={classNames(
                    styles.tab,
                    styles[`${type}Icon`],
                    expandSideBar && styles.expanded,
                    sidebarOnBottom && styles.onBottom,
                    notifProp && styles.notificationIcon,
                    backgroundBusy && styles.backgroundBusy
                  )}
                />
              )
            );
          }
        )}
      </Tabs>
    </>
  );
};

export default MenuLinks;
