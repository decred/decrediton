import { FormattedMessage as T } from "react-intl";
import { SettingsInput, SettingsTextInput, LanguageSelect, NumericInput } from "inputs";
import { InfoDocFieldModalButton } from "buttons";
import { Tooltip } from "shared";
import "style/LanguageSelect.less";
import { TESTNET, MAINNET } from "constants";

const propTypes = {
  tempSettings: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  locales: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

const AlreadySetMessage = () => <T id="settings.alreadySetFromCli" m="This was set as a command-line option when launching decrediton"/>;

// Do **not** add stuff that depends on the wallet here, as this is also used
// for startup config.
const GeneralSettings = ({
  tempSettings,
  currencies,
  locales,
  onChangeTempSettings,
  walletReady
}) => (
  <div className="settings-general">
    <div className="settings-column-title"><T id="settings.general.title" m="General" /></div>
    <div className="settings-column-content">

      <div className="settings-row">
        <div className="settings-label">
          <T id="settings.SPV" m="SPV" />
        </div>
        <Tooltip text={ <AlreadySetMessage/> } disabled={!tempSettings.spvModeFromCli}>
          <SettingsInput
            className="settings-input"
            value={tempSettings.spvMode ? "true" : "false"}
            onChange={(opt) => onChangeTempSettings({ spvMode: opt.value })}
            valueKey="key"
            labelKey="description"
            disabled={tempSettings.spvModeFromCli}
            options={[
              { key: "true", value: true, description: <T id="settings.spv.true" m="Enabled" /> },
              { key: "false", value: false, description: <T id="settings.spv.false" m="Disabled" /> }
            ]}
          />
        </Tooltip>
      </div>

      <div className="settings-row">
        <div className="settings-label">
          <T id="settings.SPVConnect" m="SPV Connect" />
        </div>
        <Tooltip text={ <AlreadySetMessage/> } disabled={!tempSettings.spvConnectFromCli}>
          <SettingsTextInput
            value={tempSettings.spvConnect}
            disabled={tempSettings.spvConnectFromCli}
            onChange={(e) => onChangeTempSettings({ spvConnect: e.target.value.split(",") })}
          />
        </Tooltip>
      </div>
      <div className="settings-row">
        <div className="settings-label">
          <T id="settings.network" m="Network" />
        </div>
        <Tooltip text={ <AlreadySetMessage/> } disabled={!tempSettings.networkFromCli}>
          <SettingsInput
            className="settings-input"
            value={tempSettings.network}
            onChange={(opt) => onChangeTempSettings({ network: opt.value })}
            valueKey="value"
            labelKey="description"
            disabled={tempSettings.networkFromCli}
            options={[
              { key: "true", value: MAINNET, description: <T id="settings.network.mainnet" m="Mainnet" /> },
              { key: "false", value: TESTNET, description: <T id="settings.network.testnet" m="Testnet" /> }
            ]}
          />
        </Tooltip>
      </div>
      {walletReady &&
        <div className="settings-row">
          <div className="settings-label">
            <T id="settings.displayedUnits" m="Displayed Units" />
          </div>
          <SettingsInput
            className="settings-input"
            value={tempSettings.currencyDisplay}
            onChange={(newCurrency) => onChangeTempSettings({ currencyDisplay: newCurrency.name })}
            valueKey="name" labelKey="name"
            options={currencies}
          />
        </div>
      }
      <div className="settings-row">
        <div className="settings-label">
          <T id="settings.locale" m="Locale" />
        </div>
        <LanguageSelect
          className="language-select-input"
          value={tempSettings.locale}
          onChange={(newLocale) => onChangeTempSettings({ locale: newLocale.key })}
          valueKey="key" labelKey="description"
          options={locales}
        />
      </div>

      <div className="settings-row">
        <div className="settings-label">
          <T id="settings.advancedDaemon.label" m="Adv. Daemon Startup" />
        </div>
        <Tooltip text={ <AlreadySetMessage/> } disabled={!tempSettings.daemonStartAdvancedFromCli}>
          <SettingsInput
            className="settings-input"
            value={tempSettings.daemonStartAdvanced ? "true" : "false"}
            onChange={(opt) => onChangeTempSettings({ daemonStartAdvanced: opt.value })}
            valueKey="key"
            labelKey="description"
            disabled={tempSettings.daemonStartAdvancedFromCli}
            options={[
              { key: "true", value: true, description: <T id="settings.advancedDaemon.true" m="Enabled" /> },
              { key: "false", value: false, description: <T id="settings.advancedDaemon.false" m="Disabled" /> }
            ]}
          />
        </Tooltip>
      </div>
      {walletReady &&
        <div className="settings-row">
          <div className="settings-label">
            <InfoDocFieldModalButton document="GapLimitInfo" modalClassName="has-warning" double draggable/>
            <div className="info-label">
              <T id="settings.gapLimit.label" m="Gap Limit" />
            </div>
          </div>
          <div className="settings-input">
            <NumericInput
              value={tempSettings.gapLimit}
              onChange={(e) => onChangeTempSettings({ gapLimit: e.target.value })}
            />
          </div>
        </div>
      }
    </div>
  </div>
);

GeneralSettings.propTypes = propTypes;

export default GeneralSettings;
