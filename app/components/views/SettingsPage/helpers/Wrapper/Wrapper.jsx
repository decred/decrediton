import styles from "./Wrapper.module.css";

const Wrapper = ({ children }) => (
  <div className={styles.wrapper}>{children}</div>
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default Wrapper;
