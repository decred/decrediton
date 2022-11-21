import { KeyBlueButton } from "buttons";
import styles from "./DeviceSetupRow.module.css";
import { classNames } from "pi-ui";
import DeviceSetupDocumentation from "../DeviceSetupDocumentation";

const DeviceSetupRow = ({
  title,
  docName,
  onClick,
  performingOperation,
  buttonLabel
}) => (
  <div className={styles.deviceSetupRow}>
    <div className={classNames(styles.icon, styles[docName])} />
    <div className="flex-column">
      <div className={styles.title}>{title}</div>
      <DeviceSetupDocumentation name={docName} />
    </div>
    <KeyBlueButton
      className={styles.button}
      onClick={onClick}
      disabled={performingOperation}
      loading={performingOperation}>
      {buttonLabel}
    </KeyBlueButton>
  </div>
);

export default DeviceSetupRow;
