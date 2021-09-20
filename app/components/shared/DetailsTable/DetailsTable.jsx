import { useState } from "react";
import { classNames } from "pi-ui";
import styles from "./DetailsTable.module.css";
import { SmallButton } from "buttons";
import {
  CopyToClipboard,
  TruncatedText,
  ExternalLink,
  ExternalButton
} from "shared";

const ValueField = ({ data }) => {
  const { value, copyable, truncate, href } = data;
  const text = truncate ? (
    <TruncatedText
      text={value}
      max={truncate}
      showTooltip
      tooltipClassName={styles.tooltipClassName}
    />
  ) : (
    value
  );

  return (
    <div
      className={classNames(
        styles.value,
        copyable && styles.copyable,
        href && styles.href
      )}>
      {copyable ? (
        <>
          <div className={styles.copyableText}>{text}</div>
          <CopyToClipboard textToCopy={value} ButtonComponent={SmallButton} />
        </>
      ) : href ? (
        <>
          <ExternalLink href={href} className={styles.link}>
            {text}
          </ExternalLink>
          <ExternalButton
            className={styles.linkButton}
            href={href}
            ButtonComponent={SmallButton}
          />
        </>
      ) : (
        text
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
  headerClassName,
  gridClassName
}) => {
  const [showDetails, setShowDetails] = useState(!expandable);
  const toggleDetailsVisibility = () => expandable && setShowDetails((b) => !b);

  return (
    <div className={className}>
      <div
        onClick={toggleDetailsVisibility}
        className={classNames(
          styles.header,
          headerClassName,
          showDetails && styles.active,
          expandable && styles.expandable
        )}>
        {title}
        {expandable && <div className={styles.arrow} />}
      </div>
      {showDetails && (
        <div className={classNames(styles.grid, gridClassName)}>
          {data?.map((node, index) => (
            <Row key={index + Math.random()} data={node} />
          ))}
        </div>
      )}
    </div>
  );
};

DetailsTable.defaultProps = {
  expandable: false
};

export default DetailsTable;
