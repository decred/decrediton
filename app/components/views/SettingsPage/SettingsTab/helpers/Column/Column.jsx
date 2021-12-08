import { classNames } from "pi-ui";
import styles from "./Column.module.css";

const Column = ({ className, children }) => (
  <div className={classNames(styles.column, className)}>{children}</div>
);

Column.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Column;
