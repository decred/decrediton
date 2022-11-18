import {
  classNames,
  Tabs,
  Tab,
  Tooltip,
  useTheme,
  getThemeProperty
} from "pi-ui";
import { useMenuLinks } from "./hooks";
import styles from "./MenuLinks.module.css";
import { MENU_LINKS_PER_ROW } from "constants/decrediton";
import { DefaultThemesWithCustomTabsProvider } from "layout";

const MenuLinks = () => {
  const {
    sidebarOnBottom,
    menuLinks,
    expandSideBar,
    activeTabIndex,
    onSelectTab
  } = useMenuLinks();

  const { theme } = useTheme();

  return (
    <DefaultThemesWithCustomTabsProvider
      themes={{
        "tab-text-color": getThemeProperty(theme, "tab-text-color-sidebar"),
        "tab-default-background": getThemeProperty(theme, "sidebar-color"),
        "tab-default-color": getThemeProperty(theme, "sidebar-color"),
        "tab-secondary-active-color": getThemeProperty(theme, "sidebar-color")
      }}>
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
          const menuLinkLabel = () => (
            <div
              className={styles.menuContent}
              data-testid={`menuLinkContent-${menuLink.icon}`}>
              <div
                className={classNames(
                  styles.icon,
                  styles[`${menuLink.icon}Icon`]
                )}
              />
              {expandSideBar && !sidebarOnBottom && (
                <div className={styles.menuLinkLabel}>{menuLink.link}</div>
              )}
            </div>
          );
          const label =
            expandSideBar && !sidebarOnBottom && !menuLink.disabled ? (
              menuLinkLabel()
            ) : (
              <Tooltip
                contentClassName={styles.tooltip}
                content={menuLink.tooltip ?? menuLink.link}
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
                  expandSideBar && styles.expanded,
                  sidebarOnBottom && styles.onBottom,
                  menuLink.notifProp && styles.notificationIcon,
                  menuLink.disabled && styles.disabled
                )}
              />
            )
          );
        })}
      </Tabs>
    </DefaultThemesWithCustomTabsProvider>
  );
};

export default MenuLinks;
