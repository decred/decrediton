import { FormattedMessage as T } from "react-intl";
import { ToggleSwitch } from "buttons";
import styles from "./AutopilotSwitch.module.css";

const AutopilotSwitch = ({ onChange, autopilotEnabled }) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <ToggleSwitch
          id="enableAutopilot"
          className={styles.switch}
          onClick={onChange}
          enabled={autopilotEnabled}
          tooltipClassName={styles.tooltipClassName}
          enabledText={
            <T
              id="ln.connectPage.autopilot.enabled"
              m="Disable automatic channel creation"
            />
          }
          notEnabledText={
            <T
              id="ln.connectPage.autopilot.not.enabled"
              m="Enable automatic channel creation"
            />
          }
        />
        <label htmlFor="enableAutopilot">
          <T
            id="ln.connectPage.automaticChannelCreation"
            m="Automatic Channel Creation"
          />
        </label>
      </div>
      <div className={styles.desc}>
        <T
          id="ln.connectPage.enableAutopilotDescr"
          m="This enables the 'autopilot' feature, which tries to automatically open channels using up to 60% of the account's spendable funds."
        />
      </div>
    </div>
  );
};

export default AutopilotSwitch;
