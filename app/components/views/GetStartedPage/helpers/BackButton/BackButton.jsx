import styles from "./BackButton.module.css";

const BackButton = ({ onClick }) => (
  <div onClick={onClick} className={styles.backButton}></div>
);

export default BackButton;
