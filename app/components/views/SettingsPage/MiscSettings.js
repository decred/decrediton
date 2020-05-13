import { FormattedMessage as T } from "react-intl";
import { SettingsInput, NumericInput } from "inputs";
import { InfoDocFieldModalButton } from "buttons";

const propTypes = {
  tempSettings: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

const MiscSettings = ({
  tempSettings,
  currencies,
  onChangeTempSettings,
  walletReady
}) => (
  <div className="settings-misc">
    <div className="settings-column-title">
      <T id="settings.misc.title" m="Misc" />
    </div>
    <div className="settings-column-content">
      {walletReady && (
        <div className="settings-row">
          <div className="settings-label">
            <T id="settings.displayedUnits" m="Displayed Units" />
          </div>
          <SettingsInput
            className="settings-input"
            value={tempSettings.currencyDisplay}
            onChange={(newCurrency) =>
              onChangeTempSettings({ currencyDisplay: newCurrency.name })
            }
            valueKey="name"
            labelKey="name"
            options={currencies}
          />
        </div>
      )}

      {walletReady && (
        <div className="settings-row">
          <div className="settings-label">
            <InfoDocFieldModalButton
              document="GapLimitInfo"
              modalClassName="has-warning"
              double
              draggable
            />
            <div className="info-label">
              <T id="settings.gapLimit.label" m="Gap Limit" />
            </div>
          </div>
          <div className="settings-input">
            <NumericInput
              value={tempSettings.gapLimit}
              onChange={(e) =>
                onChangeTempSettings({ gapLimit: e.target.value })
              }
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

MiscSettings.propTypes = propTypes;

export default MiscSettings;
