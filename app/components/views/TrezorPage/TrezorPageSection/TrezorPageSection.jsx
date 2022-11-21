import styles from "./TrezorPageSection.module.css";

const TrezorPageSection = ({ children, label }) => {
  return (
    <>
      <div className={styles.label}>{label}</div>
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default TrezorPageSection;
