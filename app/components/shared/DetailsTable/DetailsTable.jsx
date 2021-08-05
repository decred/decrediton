import { useState, Fragment } from "react";
import { classNames } from "pi-ui";
import styles from "./DetailsTable.module.css";

const DetailsTable = ({
  data,
  title,
  expandable,
  className,
  headerClassName
}) => {
  const [showDetails, setShowDetails] = useState(!expandable);
  const toggleDetailsVisibility = () => setShowDetails((b) => !b);

  return (
    <div className={className}>
      <div
        onClick={expandable && toggleDetailsVisibility}
        className={classNames(
          styles.header,
          headerClassName,
          showDetails && styles.active
        )}>
        {title}
        {expandable && <div className={styles.arrow} />}
      </div>
      {showDetails && (
        <div className={styles.grid}>
          {data?.map(({ label, value }, index) => {
            return !Array.isArray(value) ? (
              <Fragment key={index + Math.random()}>
                <label>{label}:</label>
                <div className={styles.value}>{value}</div>
              </Fragment>
            ) : (
              <Fragment key={index + Math.random()}>
                <label>{label}:</label>
                <div className={styles.secondaryGrid}>
                  {value.map(
                    (
                      { label: secondaryLabel, value: secondaryValue },
                      secondaryIndex
                    ) => (
                      <Fragment key={secondaryIndex + Math.random()}>
                        <label>{secondaryLabel}:</label>
                        <div className={styles.value}>{secondaryValue}</div>
                      </Fragment>
                    )
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DetailsTable;
