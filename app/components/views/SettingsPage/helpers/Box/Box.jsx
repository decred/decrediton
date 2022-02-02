import { classNames } from "pi-ui";
import styles from "./Box.module.css";

const Box = ({ className, children }) => (
  <div className={classNames(styles.box, className)}>{children}</div>
);

Box.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Box;
