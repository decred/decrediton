import { FormattedMessage as T } from "react-intl";
import { RadioButtonGroup, classNames } from "pi-ui";
import styles from "./TimezoneSettings.module.css";
import { Box } from "../../helpers";

const TimezoneSettings = ({
  tempSettings,
  onChangeTempSettings,
  timezoneBoxClassName
}) => {
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
    <Box className={classNames(styles.box, timezoneBoxClassName)}>
      <RadioButtonGroup
        options={timezoneOptions}
        onChange={(option) => update(option.value)}
        value={tempSettings.timezone}
        vertical
        optionsClassName={[styles.timezoneOption1, styles.timezoneOption2]}
      />
    </Box>
  );
};

TimezoneSettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired,
  timezoneBoxClassName: PropTypes.string
};
export default TimezoneSettings;
