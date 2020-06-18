import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import styles from "./Settings.module.css";

const AllowableRequestType = ({
  id,
  name,
  label,
  description,
  checked,
  onChange
}) => (
  <div className={classNames(styles.row, styles.rowChecklist)}>
    <div className={styles.label}>{label}</div>
    <div className={styles.timezoneRadio}>
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}></label>
    </div>
    <div className={styles.checklistDescription}>{description}</div>
  </div>
);

const TimezoneSettings = ({ tempSettings, onChangeTempSettings }) => {
  const update = (value) => () => {
    onChangeTempSettings({ timezone: value });
  };

  return (
    <div className={styles.timezone}>
      <div className={styles.columnTitle}>
        <T id="settings.timezone.title" m="Timezone" />
      </div>
      <div className={styles.columnContent}>
        <AllowableRequestType
          label={<T id="settings.timezone.local.label" m="Local" />}
          id="local"
          name="timezone"
          value="local"
          onChange={update("local")}
          checked={tempSettings.timezone == "local" ? true : false}
          description={
            <T
              id="settings.timezone.local.description"
              m="Use your local timezone"
            />
          }
        />
        <AllowableRequestType
          label={<T id="settings.timezone.utc.label" m="UTC" />}
          id="utc"
          name="timezone"
          value="utc"
          onChange={update("utc")}
          checked={tempSettings.timezone == "utc" ? true : false}
          description={
            <T
              id="settings.timezone.utx.description"
              m="Use Universal Coordinated Time"
            />
          }
        />
      </div>
    </div>
  );
};

export default TimezoneSettings;
