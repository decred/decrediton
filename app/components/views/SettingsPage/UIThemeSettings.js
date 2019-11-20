import { SettingsInput } from "inputs";
import { FormattedMessage as T } from "react-intl";

const availableUIThemeTypes = [
  { name: <T id="settings.uitheme.type.light" m="Light" />, value: "theme-light" },
  { name: <T id="settings.uitheme.type.dark" m="Dark" />, value: "theme-dark" }
];

const UIThemeSettings = ({
  tempSettings,
  onChangeTempSettings
}) => (
  <div className="settings-uitheme">
    <div className="settings-column-title"><T id="settings.uitheme.title" m="UI theme" /></div>
    <div className="settings-column-content">
      <div className="settings-row">
        <div className="settings-label">
          <T id="settings.uitheme.type" m="Tonality" />
        </div>
        <SettingsInput
          className="settings-input"
          value={tempSettings.theme}
          onChange={(newTheme) => onChangeTempSettings({ theme: newTheme.value })}
          valueKey="value"
          labelKey="name"
          options={availableUIThemeTypes}
        />
      </div>
    </div>
  </div>
);

export default UIThemeSettings;
