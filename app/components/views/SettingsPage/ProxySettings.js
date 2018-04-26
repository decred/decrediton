import { SettingsInput, SettingsTextInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import {
  PROXYTYPE_PAC, PROXYTYPE_HTTP, PROXYTYPE_SOCKS4, PROXYTYPE_SOCKS5
} from "main_dev/proxy";

const availableProxyTypes = [
  { name: <T id="settings.proxy.type.none" m="No Proxy"/>, value: null },
  { name: "HTTP", value: PROXYTYPE_HTTP },
  { name: "PAC", value: PROXYTYPE_PAC },
  { name: "SOCKS4", value: PROXYTYPE_SOCKS4 },
  { name: "SOCKS5", value: PROXYTYPE_SOCKS5 },
];

const ProxySettings = ({
  tempSettings,
  onChangeTempSettings
}) => (
  <div className="settings-proxy">
    <div className="settings-column-title"><T id="settings.proxy.title" m="Proxy" /></div>
    <div className="settings-column-content">

      <div className="settings-row">
        <div className="settings-label">
          <T id="settings.proxy.type" m="Proxy Type" />
        </div>
        <SettingsInput
          className="settings-input"
          value={tempSettings.proxyType}
          onChange={(newProxyType) => onChangeTempSettings({ proxyType: newProxyType.value })}
          valueKey="value"
          labelKey="name"
          options={availableProxyTypes}
        />
      </div>

      <div className="settings-row">
        <div className="settings-label">
          <T id="settings.proxy.location" m="Proxy Location" />
        </div>
        <SettingsTextInput
          value={tempSettings.proxyLocation}
          onChange={(e) => onChangeTempSettings({ proxyLocation: e.target.value })}
        />
      </div>
    </div>
  </div>
);

export default ProxySettings;
