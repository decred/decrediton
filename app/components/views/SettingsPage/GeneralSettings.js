import PropTypes from "prop-types";
import { FormattedMessage as T } from "react-intl";
import SettingsInput from "inputs/SettingsInput";

const propTypes = {
  tempSettings: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  locales: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired,
};

// Do **not** add stuff that depends on the wallet here, as this is also used
// for startup config.
const GeneralSettings = ({
  tempSettings,
  currencies,
  locales,
  onChangeTempSettings
}) => (
  <div className="settings-general">
    <div className="settings-colunm-title"><T id="settings.general.title" m="General" /></div>
      <div className="settings-column-content">

        <div className="settings-row">
          <div className="settings-label">
            <T id="settings.displayedUnits" m="Displayed Units" />
          </div>
          <SettingsInput
            className="settings-input"
            value={tempSettings.currencyDisplay}
            onChange={(newCurrency) => onChangeTempSettings({currencyDisplay: newCurrency.name})}
            valueKey="name" labelKey="name"
            options={currencies}
          />
        </div>

        <div className="settings-row">
          <div className="settings-label">
            <T id="settings.locale" m="Locale" />
          </div>
          <SettingsInput
            className="settings-input"
            value={tempSettings.locale}
            onChange={(newLocale) => onChangeTempSettings({locale: newLocale.key})}
            valueKey="key" labelKey="description"
            options={locales}
          />
        </div>
    </div>
  </div>
);

GeneralSettings.propTypes = propTypes;

export default GeneralSettings;
