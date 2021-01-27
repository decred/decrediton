import styles from "./indicators.module.css";
import { classNames } from "pi-ui";

export default ({ pageCount, currentPageIndex, onGotoPage }) => (
  <div className={styles.stepIndicator}>
    {Array(pageCount)
      .fill()
      .map((_, index) => (
        <button
          className={classNames(
            index === currentPageIndex
              ? styles.current
              : index < currentPageIndex
              ? styles.checked
              : styles.unchecked
          )}
          onClick={() => onGotoPage(index)}
          key={index}
        />
      ))}
  </div>
);
