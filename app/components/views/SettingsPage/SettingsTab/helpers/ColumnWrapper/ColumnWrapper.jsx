import styles from "./ColumnWrapper.module.css";

const ColumnWrapper = ({ children }) => (
  <div className={styles.columnWrapper}>{children}</div>
);

ColumnWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default ColumnWrapper;
