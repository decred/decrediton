import { classNames } from "pi-ui";
import styles from "./Group.module.css";

const Group = ({ className, children }) => (
  <div className={classNames(styles.group, className)}>{children}</div>
);

Group.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Group;
