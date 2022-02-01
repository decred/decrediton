import { classNames } from "pi-ui";
import styles from "./Row.module.css";

const Row = ({ children, className }) => (
  <div className={classNames(styles.row, className)}>{children}</div>
);

Row.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Row;
