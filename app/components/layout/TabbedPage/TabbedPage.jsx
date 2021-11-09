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
    history.push(tabs[index].path);
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

  themes.tabDefaultBackgroundColor = themes.tabDefaultBackgroundColor
    ? themes.tabDefaultBackgroundColor
    : "tab-default-background-tabbedpage";
  themes.tabDefaultBorderColor = themes.tabDefaultBorderColor
    ? themes.tabDefaultBorderColor
    : "tab-default-border-tabbedpage";

  return (
    <div className={styles.wrapper}>
      <div className={classNames(styles.tabbedPageHeader, headerClassName)}>
        {header}
        {SecondaryHeader && <SecondaryHeader />}
      </div>

      <div className={styles.tabbedPageBody}>
        <Tabs
          onSelectTab={onSelectTab}
          activeTabIndex={activeTabIndex}
          className={classNames(styles.tabs, tabsClassName)}
          contentClassName={classNames(styles.tabContent, tabContentClassName)}
          contentAnimation={uiAnimations ? "slide" : "none"}
          themes={themes}>
          {tabs
            .filter(({ disabled }) => !disabled)
            .map(({ label, content, path, props }) => {
              const element = React.isValidElement(content)
                ? k(content, {
                    ...props,
                    ...props?.content?.props
                  })
                : // If the content props are needed, make a valid react element
                  // before send, otherwise they will be undfined.
                  h(content, { ...props }, null);
              return (
                <Tab label={label} key={path}>
                  <div key={`${path}-key`}>{element}</div>
                </Tab>
              );
            })}
        </Tabs>
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
