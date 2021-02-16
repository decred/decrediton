import styles from "./TabsHeader.module.css";
import { Tabs, Tab, classNames } from "pi-ui";

const TabsHeader = ({ tabs, setActiveTabIndex, activeTabIndex, tabsWrapperClassName, contentClassName }) => {
  return (
    <div className={styles.tabsContainer}>
      <div
        className={classNames(
          styles.tabsWrapper,
          tabsWrapperClassName && tabsWrapperClassName
        )}>
        <Tabs
          activeTabIndex={activeTabIndex}
          onSelectTab={setActiveTabIndex}
          contentClassName={classNames(
            styles.tabsContent,
            contentClassName && contentClassName
          )}
          className={styles.tabs}>
          {tabs.map((tab, index) => {
            return (
              <Tab
                label={tab.label}
                key={index}
                className={classNames(
                  styles.tab,
                  tab.icon,
                  activeTabIndex === index ? styles.active : styles.inactive
                )}>
                {tab.component}
              </Tab>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

TabsHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  activeTabIndex: PropTypes.number,
  setActiveTabIndex: PropTypes.func
};

export default TabsHeader;
