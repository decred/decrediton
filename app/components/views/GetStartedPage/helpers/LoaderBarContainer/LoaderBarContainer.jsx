import styles from "./LoaderBarContainer.module.css";
import { classNames } from "pi-ui";

const LoaderBarContainer = ({ loaderBar, className }) => (
  <div className={classNames(styles.loaderBarContainer, className)}>
    <div className={styles.loaderBar}>{loaderBar}</div>
  </div>
);

export default LoaderBarContainer;
