import { FormattedMessage as T } from "react-intl";

const AllowableRequestType = ({ id, name, label, description, checked, onChange }) => (
  <div className="settings-row settings-row-checklist">
    <div className="settings-label">
      {label}
    </div>
    <div className="timezone-radio">
      <input type="radio" id={id} name={name} checked={checked} onChange={onChange} />
      <label htmlFor={id}></label>
    </div>
    <div className="settings-checklist-description">
      {description}
    </div>
  </div>
);


const TimezoneSettings = ({
  tempSettings,
  onChangeTempSettings
}) => {
  const update = (value) => () => {
    onChangeTempSettings({ timezone: value });
  };

  return (
    <div className="settings-timezone">
      <div className="settings-column-title"><T id="settings.timezone.title" m="Timezone" /></div>
      <div className="settings-column-content">
        <AllowableRequestType
          label={<T id="settings.timezone.local.label" m="Local" />}
          id="local"
          name="timezone"
          value="local"
          onChange={update("local")}
          checked={tempSettings.timezone == "local" ? true : false}
          description={<T id="settings.timezone.local.description" m="Use your local timezone" />}
        />
        <AllowableRequestType
          label={<T id="settings.timezone.utc.label" m="UTC" />}
          id="utc"
          name="timezone"
          value="utc"
          onChange={update("utc")}
          checked={tempSettings.timezone == "utc" ? true : false}
          description={<T id="settings.timezone.utx.description" m="Use Universal Coordinated Time" />}
        />
      </div>
    </div>
  );
};

export default TimezoneSettings;
