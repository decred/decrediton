import styles from "./ColumnTitle.module.css";

const ColumnTitle = ({ title }) => (
  <div className={styles.columnTitle}>{title}</div>
);

ColumnTitle.propTypes = {
  title: PropTypes.object.isRequired
};

export default ColumnTitle;
