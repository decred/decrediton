import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { SettingsInput, SettingsTextInput } from "inputs";
import { TESTNET, MAINNET } from "constants";
import styles from "./NetworkSettings.module.css";
import { Box, Label } from "../../helpers";

const AlreadySetMessage = () => (
  <T
    id="settings.alreadySetFromCli"
    m="This was set as a command-line option when launching decrediton"
  />
);

// Do **not** add stuff that depends on the wallet here, as this is also used
// for startup config.
const NetworkSettings = ({ tempSettings, onChangeTempSettings }) => (
  <Box className={styles.box}>
    <div>
      <Label id="network-input">
        <T id="settings.network" m="Network" />
      </Label>
      <Tooltip
        content={<AlreadySetMessage />}
        className={styles.tooltip}
        disabled={!tempSettings.networkFromCli}>
        <SettingsInput
          selectWithBigFont
          className={styles.input}
          value={tempSettings.network}
          onChange={(opt) => onChangeTempSettings({ network: opt.value })}
          valueKey="value"
          labelKey="description"
          disabled={tempSettings.networkFromCli}
          ariaLabelledBy="network-input"
          options={[
            {
              key: "true",
              value: MAINNET,
              description: <T id="settings.network.mainnet" m="Mainnet" />
            },
            {
              key: "false",
              value: TESTNET,
              description: <T id="settings.network.testnet" m="Testnet" />
            }
          ]}
        />
      </Tooltip>
    </div>

    <div>
      <Label id="spv-input">
        <T id="settings.SPV" m="SPV" />
      </Label>
      <Tooltip
        content={<AlreadySetMessage />}
        className={styles.tooltip}
        disabled={!tempSettings.spvModeFromCli}>
        <SettingsInput
          selectWithBigFont
          className={styles.input}
          value={tempSettings.spvMode ? "true" : "false"}
          onChange={(opt) => onChangeTempSettings({ spvMode: opt.value })}
          valueKey="value"
          labelKey="description"
          disabled={tempSettings.spvModeFromCli}
          ariaLabelledBy="spv-input"
          options={[
            {
              key: "true",
              value: true,
              description: <T id="settings.spv.true" m="Enabled" />
            },
            {
              key: "false",
              value: false,
              description: <T id="settings.spv.false" m="Disabled" />
            }
          ]}
        />
      </Tooltip>
    </div>

    <div>
      <Label id="adv-damon-startup-input">
        <T id="settings.advancedDaemon.label" m="Adv. Daemon Startup" />
      </Label>
      <Tooltip
        content={<AlreadySetMessage />}
        className={styles.tooltip}
        disabled={!tempSettings.daemonStartAdvancedFromCli}>
        <SettingsInput
          selectWithBigFont
          className={styles.input}
          value={tempSettings.daemonStartAdvanced ? "true" : "false"}
          onChange={(opt) =>
            onChangeTempSettings({ daemonStartAdvanced: opt.value })
          }
          valueKey="value"
          labelKey="description"
          disabled={tempSettings.daemonStartAdvancedFromCli}
          ariaLabelledBy="adv-damon-startup-input"
          options={[
            {
              key: "true",
              value: true,
              description: <T id="settings.advancedDaemon.true" m="Enabled" />
            },
            {
              key: "false",
              value: false,
              description: <T id="settings.advancedDaemon.false" m="Disabled" />
            }
          ]}
        />
      </Tooltip>
    </div>

    <div>
      <Label id="spv-connect-input">
        <T id="settings.SPVConnect" m="SPV Connect" />
      </Label>
      <Tooltip
        content={<AlreadySetMessage />}
        className={styles.tooltip}
        disabled={!tempSettings.spvConnectFromCli}>
        <SettingsTextInput
          newBiggerFontStyle
          inputClassNames={styles.settingsTextInput}
          id="spvConnectInput"
          value={tempSettings.spvConnect}
          disabled={tempSettings.spvConnectFromCli}
          ariaLabelledBy="spv-connect-input"
          onChange={(value) =>
            onChangeTempSettings({ spvConnect: value.split(",") })
          }
        />
      </Tooltip>
    </div>
  </Box>
);

NetworkSettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

export default NetworkSettings;
