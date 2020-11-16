import { FormattedMessage as T } from "react-intl";
import { SettingsInput, NumericInput } from "inputs";
import { InfoDocFieldModalButton } from "buttons";
import styles from "./Settings.module.css";

const propTypes = {
  tempSettings: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

const MiscSettings = ({
  tempSettings,
  currencies,
  onChangeTempSettings,
  walletReady
}) => (
  <div className={styles.misc}>
    <div className={styles.columnTitle}>
      <T id="settings.misc.title" m="Misc" />
    </div>
    <div className={styles.columnContent}>
      {walletReady && (
        <div className={styles.row}>
          <label id="displayed-units-input" className={styles.label}>
              <T id="settings.displayedUnits" m="Displayed Units" />
          </label>
          <SettingsInput
            className={styles.input}
            value={tempSettings.currencyDisplay}
            onChange={(newCurrency) =>
              onChangeTempSettings({ currencyDisplay: newCurrency.name })
            }
            ariaLabelledBy="displayed-units-input"
            valueKey="name"
            labelKey="name"
            options={currencies}
          />
        </div>
      )}

      {walletReady && (
        <div className={styles.row}>
          <div className={styles.label}>
            <InfoDocFieldModalButton
              document="GapLimitInfo"
              modalClassName={styles.hasWarning}
              double
              draggable
            />
            <label id="gap-limit-input" className={styles.label}>
              <T id="settings.gapLimit.label" m="Gap Limit" />
            </label>
          </div>
          <div className={styles.input}>
            <NumericInput
              value={tempSettings.gapLimit}
              ariaLabelledBy="gap-limit-input"
              onChange={(e) =>
                onChangeTempSettings({ gapLimit: e.target.value })
              }
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

MiscSettings.propTypes = propTypes;

export default MiscSettings;
