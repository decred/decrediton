import { FormattedMessage as T } from "react-intl";
import { RadioButtonGroup, classNames } from "pi-ui";
import styles from "./Settings.module.css";

const TimezoneSettings = ({ tempSettings, onChangeTempSettings }) => {
  const update = (value) => {
    onChangeTempSettings({ timezone: value });
  };
  const timezoneOptions = [
    {
      value: "local",
      label: "Local",
      description: (
        <T
          id="settings.timezone.local.description"
          m="Use your local timezone"
        />
      )
    },
    {
      value: "utc",
      label: "UTC",
      description: (
        <T
          id="settings.timezone.utx.description"
          m="Use Universal Coordinated Time"
        />
      )
    }
  ];

  return (
    <div className={styles.timezone}>
      <div className={styles.columnTitle}>
        <T id="settings.timezone.title" m="Timezone" />
      </div>
      <div
        className={classNames(
          styles.columnContent,
          styles.radioButtonsWrapper
        )}>
        <RadioButtonGroup
          options={timezoneOptions}
          onChange={(option) => update(option.value)}
          value={tempSettings.timezone}
          vertical
          optionsClassName={styles.timezoneOption}
        />
      </div>
    </div>
  );
};

export default TimezoneSettings;
