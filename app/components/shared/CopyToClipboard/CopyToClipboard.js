// @flow
import copy from "clipboard-copy";
import { FormattedMessage as T } from "react-intl";
import styles from "./CopyToClipboard.module.css";
import { classNames } from "pi-ui";
import { useState } from "react";

const CopyToClipboard = ({ textToCopy, className }) => {
  const [isSuccessHidden, setIsSuccessHidden] = useState(true);

  function onClick() {
    if (copy(textToCopy)) setIsSuccessHidden(false);
  }

  function onMouseLeave() {
    if (!isSuccessHidden) setIsSuccessHidden(true);
  }

  return (
    <div className={classNames(styles.clipboardBox, className && className)}>
      <div
        className={classNames(
          styles.copyToClipboardSuccess,
          isSuccessHidden && styles.hidden
        )}>
        <T id="clipboard.copied" m="Copied" />
      </div>
      <button
        className={styles.copyToClipboardIcon}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        aria-label="Copy"
      />
    </div>
  );
};

CopyToClipboard.propTypes = { textToCopy: PropTypes.string.isRequired };

export default CopyToClipboard;
