import { FormattedMessage as T } from "react-intl";
import { SettingsInput, LanguageSelectInput } from "inputs";
import { InfoDocFieldModalInvisibleButton } from "buttons";
import styles from "./UISettings.module.css";
import {
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME,
  classNames
} from "pi-ui";
import { Box, Label } from "../../../helpers";

const availableUIThemeTypes = [
  {
    name: <T id="settings.uitheme.type.light" m="Light" />,
    value: DEFAULT_LIGHT_THEME_NAME
  },
  {
    name: <T id="settings.uitheme.type.dark" m="Dark" />,
    value: DEFAULT_DARK_THEME_NAME
  }
];

const UISettings = ({ tempSettings, locales, onChangeTempSettings }) => (
  <Box className={styles.box}>
    <div>
      <Label id="theme-input">
        <T id="settings.uitheme.type" m="Tonality" />
      </Label>
      <SettingsInput
        className={classNames(styles.input, "selectWithBigFont")}
        value={tempSettings.theme}
        ariaLabelledBy="theme-input"
        onChange={(newTheme) => onChangeTempSettings({ theme: newTheme.value })}
        valueKey="value"
        labelKey="name"
        options={availableUIThemeTypes}
      />
    </div>

    <div>
      <Label id="locale-input">
        <T id="settings.locale" m="Locale" />
      </Label>
      <LanguageSelectInput
        className={classNames(styles.input, "selectWithBigFont")}
        value={tempSettings.locale}
        onChange={(newLocale) =>
          onChangeTempSettings({ locale: newLocale.key })
        }
        ariaLabelledBy="locale-input"
        valueKey="key"
        labelKey="description"
        options={locales}
      />
    </div>

    <div>
      <Label id="ui-animation" className={styles.label}>
        <T id="settings.uiAnimations.label" m="UI Animations" />
      </Label>
      <SettingsInput
        className={classNames(styles.input, "selectWithBigFont")}
        value={tempSettings.uiAnimations ? "true" : "false"}
        onChange={(newUIAnimations) =>
          onChangeTempSettings({ uiAnimations: newUIAnimations.value })
        }
        valueKey="value"
        labelKey="description"
        options={[
          {
            key: "true",
            value: true,
            description: <T id="settings.uiAnimations.enabled" m="Enabled" />
          },
          {
            key: "false",
            value: false,
            description: <T id="settings.uiAnimations.disabled" m="Disabled" />
          }
        ]}
      />
      <InfoDocFieldModalInvisibleButton
        document="UIAnimationsInfo"
        className={styles.infoButton}
        modalClassName={styles.hasWarning}
        buttonLabel={
          <T id="settings.uiAnimations.whatsthis" m="What’s this?" />
        }
        draggable
      />
    </div>
  </Box>
);

UISettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  locales: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

export default UISettings;
