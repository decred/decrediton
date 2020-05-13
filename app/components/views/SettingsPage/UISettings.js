import { FormattedMessage as T } from "react-intl";
import { SettingsInput, LanguageSelect } from "inputs";
import "style/LanguageSelect.less";

const propTypes = {
  tempSettings: PropTypes.object.isRequired,
  locales: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

const availableUIThemeTypes = [
  {
    name: <T id="settings.uitheme.type.light" m="Light" />,
    value: "theme-light"
  },
  { name: <T id="settings.uitheme.type.dark" m="Dark" />, value: "theme-dark" }
];

const UISettings = ({ tempSettings, locales, onChangeTempSettings }) => (
  <div className="settings-ui">
    <div className="settings-column-title">
      <T id="settings.ui.title" m="UI" />
    </div>
    <div className="settings-column-content">
      <div className="settings-row">
        <div className="settings-label">
          <T id="settings.uitheme.type" m="Tonality" />
        </div>
        <SettingsInput
          className="settings-input"
          value={tempSettings.theme}
          onChange={(newTheme) =>
            onChangeTempSettings({ theme: newTheme.value })
          }
          valueKey="value"
          labelKey="name"
          options={availableUIThemeTypes}
        />
      </div>

      <div className="settings-row">
        <div className="settings-label">
          <T id="settings.locale" m="Locale" />
        </div>
        <LanguageSelect
          className="language-select-input"
          value={tempSettings.locale}
          onChange={(newLocale) =>
            onChangeTempSettings({ locale: newLocale.key })
          }
          valueKey="key"
          labelKey="description"
          options={locales}
        />
      </div>
    </div>
  </div>
);

UISettings.propTypes = propTypes;

export default UISettings;
