import styles from "./Wrapper.module.css";
import { classNames } from "pi-ui";

const Wrapper = ({ className, children }) => (
  <div className={classNames(styles.wrapper, className)}>{children}</div>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default Wrapper;
