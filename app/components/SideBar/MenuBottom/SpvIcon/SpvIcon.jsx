import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import styles from "./SpvIcon.module.css";
import { classNames } from "pi-ui";

const SpvIcon = ({ isSPV }) => (
  <Tooltip
    className={styles.tooltip}
    text={
      isSPV ? (
        <T id="sidebar.spvMode" m="SPV Mode" />
      ) : (
        <T id="sidebar.spvDisabled" m="SPV disabled" />
      )
    }>
    <div className={classNames(styles.spvIcon, !isSPV && styles.off)} />
  </Tooltip>
);

export default SpvIcon;
