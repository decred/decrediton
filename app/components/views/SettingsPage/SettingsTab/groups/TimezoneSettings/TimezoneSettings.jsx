import { FormattedMessage as T } from "react-intl";
import { RadioButtonGroup } from "pi-ui";
import styles from "./TimezoneSettings.module.css";
import { ColumnTitle } from "../../helpers";

const TimezoneSettings = ({ tempSettings, onChangeTempSettings }) => {
  const update = (value) => onChangeTempSettings({ timezone: value });

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
    <>
      <ColumnTitle title={<T id="settings.timezone.title" m="Timezone" />} />
      <RadioButtonGroup
        options={timezoneOptions}
        onChange={(option) => update(option.value)}
        value={tempSettings.timezone}
        vertical
        optionsClassName={styles.timezoneOption}
      />
    </>
  );
};

TimezoneSettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

export default TimezoneSettings;
