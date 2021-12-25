import { SettingsInput, SettingsTextInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import {
  PROXYTYPE_PAC,
  PROXYTYPE_HTTP,
  PROXYTYPE_SOCKS4,
  PROXYTYPE_SOCKS5
} from "constants";
import styles from "./ProxySettings.module.css";
import { Label, Box } from "../../../helpers";
import { classNames } from "pi-ui";

const availableProxyTypes = [
  { name: <T id="settings.proxy.type.none" m="No Proxy" />, value: null },
  { name: "HTTP", value: PROXYTYPE_HTTP },
  { name: "PAC", value: PROXYTYPE_PAC },
  { name: "SOCKS4", value: PROXYTYPE_SOCKS4 },
  { name: "SOCKS5", value: PROXYTYPE_SOCKS5 }
];

const ProxySettings = ({ tempSettings, onChangeTempSettings }) => (
  <Box className={styles.box}>
    <div>
      <Label id="proxy-type-input">
        <T id="settings.proxy.type" m="Proxy Type" />
      </Label>
      <SettingsInput
        className={classNames(styles.input, "selectWithBigFont")}
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

    <div>
      <Label id="proxy-location">
        <T id="settings.proxy.location" m="Proxy Location" />
      </Label>
      <SettingsTextInput
        newBiggerFontStyle
        className={styles.settingsTextInput}
        id="proxyLocationInput"
        value={tempSettings.proxyLocation}
        ariaLabelledBy="proxy-location"
        onChange={(e) =>
          onChangeTempSettings({ proxyLocation: e.target.value })
        }
      />
    </div>
  </Box>
);

ProxySettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

export default ProxySettings;
