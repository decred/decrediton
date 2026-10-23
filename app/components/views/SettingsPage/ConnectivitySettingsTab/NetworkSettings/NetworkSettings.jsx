import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { SettingsInput, SettingsTextInput } from "inputs";
import { TESTNET, MAINNET } from "constants";
import styles from "./NetworkSettings.module.css";
import { Box, Label } from "../../helpers";

const SettingsInputWrapper = ({ isTooltipEnabled, children }) =>
  isTooltipEnabled ? (
    <Tooltip
      content={
        <T
          id="settings.alreadySetFromCli"
          m="This was set as a command-line option when launching decrediton"
        />
      }
      className={styles.tooltip}>
      {children}
    </Tooltip>
  ) : (
    children
  );

SettingsInputWrapper.propTypes = {
  isTooltipEnabled: PropTypes.bool,
  children: PropTypes.object.isRequired
};

// Do **not** add stuff that depends on the wallet here, as this is also used
// for startup config.
const NetworkSettings = ({ tempSettings, onChangeTempSettings }) => (
  <Box className={styles.box}>
    <div>
      <Label id="network-input">
        <T id="settings.network" m="Network" />
      </Label>
      <SettingsInputWrapper isTooltipEnabled={tempSettings.networkFromCli}>
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
      </SettingsInputWrapper>
    </div>

    <div>
      <Label id="spv-input">
        <T id="settings.SPV" m="SPV" />
      </Label>
      <SettingsInputWrapper isTooltipEnabled={tempSettings.spvModeFromCli}>
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
      </SettingsInputWrapper>
    </div>

    <div>
      <Label id="adv-damon-startup-input">
        <T id="settings.advancedDaemon.label" m="Adv. Daemon Startup" />
      </Label>
      <SettingsInputWrapper
        isTooltipEnabled={tempSettings.daemonStartAdvancedFromCli}>
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
      </SettingsInputWrapper>
    </div>

    <div>
      <Label id="spv-connect-input">
        <T id="settings.SPVConnect" m="SPV Connect" />
      </Label>
      <SettingsInputWrapper isTooltipEnabled={tempSettings.spvConnectFromCli}>
        <SettingsTextInput
          newBiggerFontStyle
          inputClassNames={styles.settingsTextInput}
          id="spvConnectInput"
          value={tempSettings.spvConnect}
          disabled={tempSettings.spvConnectFromCli}
          ariaLabelledBy="spv-connect-input"
          onChange={(value) => {
            onChangeTempSettings({
              spvConnect: value ? value.split(",") : []
            });
          }}
        />
      </SettingsInputWrapper>
    </div>
  </Box>
);

NetworkSettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

export default NetworkSettings;
