import { FormattedMessage as T } from "react-intl";
import { Checkbox } from "pi-ui";
import styles from "./LauncherSettings.module.css";
import { Box } from "../../helpers";

const LauncherSettings = ({ tempSettings, onChangeTempSettings }) => {
  return (
    <Box>
      <Checkbox
        label={
          <T
            id="launcherSettings.checkboxLabel"
            m="Launch wallet immediately after loading completes"
          />
        }
        id="autostart"
        description={
          <T id="launcherSettings.checkboxDesc" m="Open wallet automatically" />
        }
        checked={tempSettings.autoWalletLaunching}
        className={styles.checkbox}
        onChange={() =>
          onChangeTempSettings({
            autoWalletLaunching: !tempSettings.autoWalletLaunching
          })
        }
      />
    </Box>
  );
};

LauncherSettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};
export default LauncherSettings;
