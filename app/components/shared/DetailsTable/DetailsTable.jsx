import { useState } from "react";
import { classNames } from "pi-ui";
import styles from "./DetailsTable.module.css";
import { SmallButton } from "buttons";
import { CopyToClipboard, TruncatedText } from "shared";

const ValueField = ({ data }) => {
  const { value, copyable, truncate } = data;
  const truncatedText = truncate ? (
    <TruncatedText text={value} max={truncate} showTooltip />
  ) : (
    value
  );
  return (
    <div className={classNames(styles.value, copyable && styles.copyable)}>
      {copyable ? (
        <>
          <div className={styles.copyableText}>{truncatedText}</div>
          <CopyToClipboard textToCopy={value} ButtonComponent={SmallButton} />
        </>
      ) : (
        truncatedText
      )}
    </div>
  );
};

const SubTable = ({ data }) => (
  <>
    <label>{data.label}:</label>
    <div className={styles.secondaryGrid}>
      {data.value.map((node, subIndex) => (
        <Row key={subIndex + Math.random()} data={node} />
      ))}
    </div>
  </>
);

const Row = ({ data }) =>
  !Array.isArray(data.value) ? (
    <>
      <label>{data.label}:</label>
      <ValueField data={data} />
    </>
  ) : (
    <SubTable data={data} />
  );

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
          {data?.map((node, index) => (
            <Row key={index + Math.random()} data={node} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailsTable;
