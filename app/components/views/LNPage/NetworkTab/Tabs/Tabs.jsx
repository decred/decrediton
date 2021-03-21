import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import styles from "./Tabs.module.css";

const Tabs = ({ active, set }) => {
  const QUERY_NODE = 0;
  const QUERY_ROUTE = 1;
  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabs}>
        <div
          className={classNames(
            styles.tabLeft,
            active === QUERY_NODE
              ? styles.tabBackgroundSelected
              : styles.tabBackgroundUnselected
          )}
          onClick={() => set(QUERY_NODE)}>
          <T id="ln.networkTab.tabQueryNode" m="Query Node" />
        </div>
        <div
          className={classNames(
            styles.tabRight,
            active === QUERY_ROUTE
              ? styles.tabBackgroundSelected
              : styles.tabBackgroundUnselected
          )}
          onClick={() => set(QUERY_ROUTE)}>
          <T id="ln.networkTab.tabQueryRoute" m="Query Route" />
        </div>
      </div>
    </div>
  );
};

export default Tabs;
