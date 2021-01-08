import { FormattedMessage as T } from "react-intl";
import { SettingsInput, LanguageSelectInput } from "inputs";
import { InfoDocFieldModalButton } from "buttons";
import { classNames } from "pi-ui";
import styles from "./Settings.module.css";

const propTypes = {
  tempSettings: PropTypes.object.isRequired,
  locales: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

const availableUIThemeTypes = [
  {
    name: <T id="settings.uitheme.type.light" m="Light" />,
    value: "theme-light"
  },
  { name: <T id="settings.uitheme.type.dark" m="Dark" />, value: "theme-dark" }
];

const UISettings = ({ tempSettings, locales, onChangeTempSettings }) => (
  <div>
    <div className={styles.columnTitle}>
      <T id="settings.ui.title" m="UI" />
    </div>
    <div className={styles.columnContent}>
      <div className={styles.row}>
        <div className={styles.label}>
          <T id="settings.uitheme.type" m="Tonality" />
        </div>
        <SettingsInput
          className={styles.input}
          value={tempSettings.theme}
          onChange={(newTheme) =>
            onChangeTempSettings({ theme: newTheme.value })
          }
          valueKey="value"
          labelKey="name"
          options={availableUIThemeTypes}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.label}>
          <T id="settings.locale" m="Locale" />
        </div>
        <LanguageSelectInput
          className={styles.input}
          value={tempSettings.locale}
          onChange={(newLocale) =>
            onChangeTempSettings({ locale: newLocale.key })
          }
          valueKey="key"
          labelKey="description"
          options={locales}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.label}>
          <T id="settings.uiAnimations.label" m="UI Animations" />
          <InfoDocFieldModalButton
            document="UIAnimationsInfo"
            modalClassName={classNames(styles.hasWarning, styles.uiAnimations)}
            draggable
          />
        </div>
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
      </div>
    </div>
  </div>
);

UISettings.propTypes = propTypes;

export default UISettings;
