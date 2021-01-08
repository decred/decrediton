import { FormattedMessage as T } from "react-intl";
import { SettingsInput, LanguageSelectInput } from "inputs";
import { InfoDocFieldModalButton } from "buttons";
import { classNames, Checkbox } from "pi-ui";
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

      <div className={classNames(styles.row, styles.uiAnimations)}>
        <Checkbox
          label={
            <div className={styles.label}>
              <div className={styles.infoLabel}>
                <T id="settings.uiAnimations.label" m="UI Animations" />
              </div>
            </div>
          }
          id="animations"
          checked={tempSettings.uiAnimations}
          onChange={() =>
            onChangeTempSettings({ uiAnimations: !tempSettings.uiAnimations })
          }
        />
        <InfoDocFieldModalButton
          document="UIAnimationsInfo"
          modalClassName={classNames(styles.hasWarning, styles.uiAnimations)}
          draggable
        />
      </div>
    </div>
  </div>
);

UISettings.propTypes = propTypes;

export default UISettings;
