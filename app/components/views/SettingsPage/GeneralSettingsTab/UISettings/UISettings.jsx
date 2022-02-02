import { FormattedMessage as T } from "react-intl";
import { SettingsInput, LanguageSelectInput } from "inputs";
import { InfoDocFieldModalInvisibleButton } from "buttons";
import styles from "./UISettings.module.css";
import {
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME,
  classNames
} from "pi-ui";
import { Box, Label } from "../../helpers";

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

const UISettings = ({
  tempSettings,
  locales,
  onChangeTempSettings,
  uiBoxClassName
}) => (
  <Box className={classNames(styles.box, uiBoxClassName)}>
    <div>
      <Label id="theme-input">
        <T id="settings.uitheme.type" m="Tonality" />
      </Label>
      <SettingsInput
        selectWithBigFont
        className={styles.input}
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
        selectWithBigFont
        className={styles.input}
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
        selectWithBigFont
        className={styles.input}
        value={tempSettings.uiAnimations ? "true" : "false"}
        onChange={(newUIAnimations) =>
          onChangeTempSettings({ uiAnimations: newUIAnimations.value })
        }
        valueKey="value"
        labelKey="description"
        ariaLabelledBy="ui-animation"
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
  onChangeTempSettings: PropTypes.func.isRequired,
  uiBoxClassName: PropTypes.string
};

export default UISettings;
