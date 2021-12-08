import { FormattedMessage as T } from "react-intl";
import { SettingsInput, LanguageSelectInput } from "inputs";
import { InfoDocFieldModalButton } from "buttons";
import styles from "./UISettings.module.css";
import { DEFAULT_DARK_THEME_NAME, DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import { Row, Label, ColumnTitle } from "../../helpers";

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
  <>
    <ColumnTitle title={<T id="settings.ui.title" m="UI" />} />
    <div>
      <Row>
        <Label id="theme-input">
          <T id="settings.uitheme.type" m="Tonality" />
        </Label>
        <SettingsInput
          className={styles.input}
          value={tempSettings.theme}
          ariaLabelledBy="theme-input"
          onChange={(newTheme) =>
            onChangeTempSettings({ theme: newTheme.value })
          }
          valueKey="value"
          labelKey="name"
          options={availableUIThemeTypes}
        />
      </Row>

      <Row>
        <Label id="locale-input">
          <T id="settings.locale" m="Locale" />
        </Label>
        <LanguageSelectInput
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
      </Row>

      <Row>
        <Label id="ui-animation" className={styles.label}>
          <T id="settings.uiAnimations.label" m="UI Animations" />
          <InfoDocFieldModalButton
            document="UIAnimationsInfo"
            modalClassName={styles.hasWarning}
            draggable
          />
        </Label>
        <SettingsInput
          className={styles.input}
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
              description: (
                <T id="settings.uiAnimations.disabled" m="Disabled" />
              )
            }
          ]}
        />
      </Row>
    </div>
  </>
);

UISettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  locales: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

export default UISettings;
