import { SettingsInput, SettingsTextInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import {
  PROXYTYPE_PAC,
  PROXYTYPE_HTTP,
  PROXYTYPE_SOCKS4,
  PROXYTYPE_SOCKS5
} from "main_dev/proxy";
import styles from "./Settings.module.css";

const availableProxyTypes = [
  { name: <T id="settings.proxy.type.none" m="No Proxy" />, value: null },
  { name: "HTTP", value: PROXYTYPE_HTTP },
  { name: "PAC", value: PROXYTYPE_PAC },
  { name: "SOCKS4", value: PROXYTYPE_SOCKS4 },
  { name: "SOCKS5", value: PROXYTYPE_SOCKS5 }
];

const ProxySettings = ({ tempSettings, onChangeTempSettings }) => (
  <div className={styles.proxy}>
    <div className={styles.columnTitle}>
      <T id="settings.proxy.title" m="Proxy" />
    </div>
    <div className={styles.columnContent}>
      <div className={styles.row}>
        <label id="proxy-type-input" className={styles.label}>
          <T id="settings.proxy.type" m="Proxy Type" />
        </label>
        <div className={styles.label}>
        </div>
        <SettingsInput
          className={styles.input}
          value={tempSettings.proxyType}
          onChange={(newProxyType) =>
            onChangeTempSettings({ proxyType: newProxyType.value })
          }
          valueKey="value"
          labelKey="name"
          ariaLabelledBy="proxy-type-input"
          options={availableProxyTypes}
        />
      </div>

      <div className={styles.row}>
        <label id="proxy-location" className={styles.label}>
          <T id="settings.proxy.location" m="Proxy Location" />
        </label>
        <SettingsTextInput
          value={tempSettings.proxyLocation}
          ariaLabelledBy="proxy-location"
          onChange={(e) =>
            onChangeTempSettings({ proxyLocation: e.target.value })
          }
        />
      </div>
    </div>
  </div>
);

export default ProxySettings;
