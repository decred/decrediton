import { classNames } from "pi-ui";
import styles from "./PrivacyOption.module.css";

const PrivacyOption = ({
  title,
  description,
  icon,
  onClick,
  iconClassName,
  textClassName,
  className
}) => (
  <div className={classNames(styles.option, className)} onClick={onClick}>
    <div className={classNames(styles.icon, styles[icon], iconClassName)} />
    <div className={classNames(styles.textContainer, textClassName)}>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  </div>
);

export default PrivacyOption;
