// @flow
import copy from "clipboard-copy";
import { FormattedMessage as T } from "react-intl";
import styles from "./CopyToClipboard.module.css";
import { classNames } from "pi-ui";
import { useState } from "react";

const CopyToClipboard = ({ textToCopy, ButtonComponent, className }) => {
  const [isSuccessHidden, setIsSuccessHidden] = useState(true);

  const onClick = () => {
    if (copy(textToCopy)) setIsSuccessHidden(false);
  };

  const onMouseLeave = () => {
    if (!isSuccessHidden) setIsSuccessHidden(true);
  };

  return (
    <div className={classNames(styles.box, className && className)}>
      <div
        className={classNames(
          styles.success,
          isSuccessHidden && styles.hidden
        )}>
        <T id="clipboard.copied" m="Copied" />
      </div>
      {ButtonComponent ? (
        <ButtonComponent
          className={styles.icon}
          onClick={onClick}
          onMouseLeave={onMouseLeave}
          aria-label="Copy"
        />
      ) : (
        <button
          className={styles.icon}
          onClick={onClick}
          onMouseLeave={onMouseLeave}
          aria-label="Copy"
        />
      )}
    </div>
  );
};

CopyToClipboard.propTypes = { textToCopy: PropTypes.string.isRequired };

export default CopyToClipboard;
