// @flow
import copy from "clipboard-copy";
import { FormattedMessage as T } from "react-intl";
import styles from "./CopyToClipboardButton.module.css";
import { classNames, ButtonIcon, useTheme, getThemeProperty } from "pi-ui";
import { useState } from "react";

const CopyToClipboardButton = ({ textToCopy, className }) => {
  const { theme } = useTheme();
  const iconColor = getThemeProperty(theme, "accent-blue");

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
      <ButtonIcon
        type="copyToClipboard"
        iconBackgroundColor={iconColor}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        aria-label="Copy"
      />
    </div>
  );
};

CopyToClipboardButton.propTypes = { textToCopy: PropTypes.string.isRequired };

export default CopyToClipboardButton;
