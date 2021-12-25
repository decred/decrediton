import { classNames } from "pi-ui";
import styles from "./GroupWrapper.module.css";

const GroupWrapper = ({ className, children }) => (
  <div className={classNames(styles.groupWrapper, className)}>{children}</div>
);

GroupWrapper.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default GroupWrapper;
