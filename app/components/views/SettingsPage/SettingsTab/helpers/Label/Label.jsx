import styles from "./Label.module.css";

const Label = ({ id, children }) => (
  <div id={id} className={styles.label}>
    {children}
  </div>
);

Label.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default Label;
