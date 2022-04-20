import {
  useState,
  useEffect,
  createElement as h,
  cloneElement as k
} from "react";
import { useHistory } from "react-router-dom";
import { classNames, Tabs, Tab } from "pi-ui";
import styles from "./TabbedPage.module.css";
import * as sel from "selectors";
import { useSelector } from "react-redux";
import DefaultThemesWithCustomTabsProvider from "../DefaultThemesWithCustomTabsProvider";

const TabbedPage = ({
  tabs,
  header,
  headerClassName,
  tabsClassName,
  tabContentClassName,
  themes
}) => {
  const location = useSelector(sel.location);
  const uiAnimations = useSelector(sel.uiAnimations);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const history = useHistory();

  const onSelectTab = (index) => {
    setActiveTabIndex(index);
    if (tabs[index].path) {
      history.push(tabs[index].path);
    }
  };

  useEffect(() => {
    const tabIndex = tabs.findIndex(
      (menuLink) => menuLink.path === location.pathname
    );
    if (tabIndex !== activeTabIndex && tabIndex > 0) {
      setActiveTabIndex(tabIndex);
    }
  }, [location, activeTabIndex, tabs]);

  const SecondaryHeader = tabs[activeTabIndex].header;

  return (
    <div className={styles.wrapper}>
      <div className={classNames(styles.tabbedPageHeader, headerClassName)}>
        {header}
        {SecondaryHeader && <SecondaryHeader />}
      </div>

      <div className={styles.tabbedPageBody}>
        <DefaultThemesWithCustomTabsProvider themes={themes}>
          <Tabs
            onSelectTab={onSelectTab}
            activeTabIndex={activeTabIndex}
            className={classNames(styles.tabs, tabsClassName)}
            contentClassName={classNames(
              styles.tabContent,
              tabContentClassName
            )}
            contentAnimation={uiAnimations ? "slide" : "none"}>
            {tabs
              .filter(({ disabled }) => !disabled)
              .map(({ label, content, path, props, key }) => {
                const element = React.isValidElement(content)
                  ? k(content, {
                      ...props,
                      ...props?.content?.props
                    })
                  : // If the content props are needed, make a valid react element
                    // before send, otherwise they will be undfined.
                    h(content, { ...props }, null);
                return (
                  <Tab label={label} key={key ?? path}>
                    <div
                      key={`${key ?? path}-key`}
                      className={styles.tabContentContainer}>
                      {element}
                    </div>
                  </Tab>
                );
              })}
          </Tabs>
        </DefaultThemesWithCustomTabsProvider>
      </div>
    </div>
  );
};

TabbedPage.propTypes = {
  tabs: PropTypes.array.isRequired,
  header: PropTypes.object.isRequired,
  headerClassName: PropTypes.string,
  tabsClassName: PropTypes.string,
  tabContentClassName: PropTypes.string,
  themes: PropTypes.object
};

TabbedPage.defaultProps = {
  themes: {}
};

export default TabbedPage;
