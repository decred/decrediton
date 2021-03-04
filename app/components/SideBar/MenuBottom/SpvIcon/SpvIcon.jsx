import { FormattedMessage as T } from "react-intl";
import styles from "./SpvIcon.module.css";
import { classNames, Tooltip } from "pi-ui";

const SpvIcon = ({ isSPV }) => (
  <Tooltip
    className={styles.tooltip}
    placement="right"
    content={
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
