import styles from "./TabsHeader.module.css";
import { Tabs, Tab, classNames } from "pi-ui";

const TabsHeader = ({ tabs, setActiveTabIndex, activeTabIndex }) => {
  return (
    <div className={styles.tabsWrapper}>
      <Tabs
        activeTabIndex={activeTabIndex}
        onSelectTab={setActiveTabIndex}
        contentClassName={styles.tabsContent}
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
  );
};

TabsHeader.propTypes = {
  tabs: PropTypes.array.isRequired,
  activeTabIndex: PropTypes.number,
  setActiveTabIndex: PropTypes.func
};

export default TabsHeader;
