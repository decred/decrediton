import styles from "./TabsHeader.module.css";
import { Tabs, Tab, classNames } from "pi-ui";

const TabsHeader = ({
  tabs,
  setActiveTabIndex,
  activeTabIndex,
  className,
  contentClassName,
  wrapperClassName
}) => {
  return (
    <div className={styles.tabsContainer}>
      <div className={classNames(styles.tabsWrapper, wrapperClassName)}>
        <Tabs
          activeTabIndex={activeTabIndex}
          onSelectTab={setActiveTabIndex}
          contentClassName={classNames(styles.tabsContent, contentClassName)}
          className={classNames(styles.tabs, className)}>
          {tabs.map((tab, index) => (
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
          ))}
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
