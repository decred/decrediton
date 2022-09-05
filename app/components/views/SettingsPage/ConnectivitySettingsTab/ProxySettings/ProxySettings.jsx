import { SettingsInput, SettingsTextInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import {
  PROXYTYPE_PAC,
  PROXYTYPE_HTTP,
  PROXYTYPE_SOCKS4,
  PROXYTYPE_SOCKS5
} from "constants";
import styles from "./ProxySettings.module.css";
import { Label, Box } from "../../helpers";
import { useProxySettings } from "./hooks";
import { Button } from "pi-ui";

const availableProxyTypes = [
  { name: <T id="settings.proxy.type.none" m="No Proxy" />, value: null },
  { name: "HTTP", value: PROXYTYPE_HTTP },
  { name: "PAC", value: PROXYTYPE_PAC },
  { name: "SOCKS4", value: PROXYTYPE_SOCKS4 },
  { name: "SOCKS5", value: PROXYTYPE_SOCKS5 }
];

const ProxySettings = ({ tempSettings, onChangeTempSettings }) => {
  const {
    proxyType,
    proxyLocation,
    setProxyType,
    setProxyLocation
  } = useProxySettings(tempSettings);

  const isProxySettingsChanged =
    proxyType !== tempSettings.proxyType ||
    proxyLocation !== tempSettings.proxyLocation;

  return (
    <Box className={styles.box}>
      <div>
        <Label id="proxy-type-input">
          <T id="settings.proxy.type" m="Proxy Type" />
        </Label>
        <SettingsInput
          selectWithBigFont
          className={styles.input}
          value={proxyType}
          onChange={(newProxyType) => setProxyType(newProxyType.value)}
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
          inputClassNames={styles.settingsTextInput}
          id="proxyLocationInput"
          value={proxyLocation}
          ariaLabelledBy="proxy-location"
          onChange={(value) => setProxyLocation(value)}
        />
      </div>

      {isProxySettingsChanged && (
        <Button
          className={styles.submitButton}
          size="sm"
          onClick={() => onChangeTempSettings({ proxyType, proxyLocation })}>
          <T id="settings.proxy.save" m="Save proxy settings" />
        </Button>
      )}
    </Box>
  );
};

ProxySettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

export default ProxySettings;
