import styles from "./TabLabel.module.css";
import { classNames } from "pi-ui";

const TabLabel = ({
  slides,
  index,
  activeTabIndex,
  visited,
  tabRef,
  className
}) => (
  <div
    ref={tabRef}
    className={classNames(
      styles.tabLabelContent,
      activeTabIndex === parseInt(index) && styles.active,
      visited && styles.visited,
      className
    )}>
    <strong>
      {parseInt(index) + 1}/{slides.length}
    </strong>
    <div className={styles.label}>{slides[index].label}</div>
  </div>
);

TabLabel.propTypes = {
  slides: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  activeTabIndex: PropTypes.number,
  visited: PropTypes.bool.isRequired,
  tabRef: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default TabLabel;
