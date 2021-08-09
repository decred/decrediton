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

  const DefaultButtonComponent = (props) => <button {...props} />;
  const CopyButton = ButtonComponent || DefaultButtonComponent;

  return (
    <div className={classNames(styles.box, className && className)}>
      <div
        className={classNames(
          styles.success,
          isSuccessHidden && styles.hidden
        )}>
        <T id="clipboard.copied" m="Copied" />
      </div>
      <CopyButton
        className={styles.icon}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        aria-label="Copy"
      />
    </div>
  );
};

CopyToClipboard.propTypes = { textToCopy: PropTypes.string.isRequired };

export default CopyToClipboard;
