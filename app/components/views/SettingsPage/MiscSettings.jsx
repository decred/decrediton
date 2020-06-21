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
          <div className={styles.label}>
            <T id="settings.displayedUnits" m="Displayed Units" />
          </div>
          <SettingsInput
            className={styles.input}
            value={tempSettings.currencyDisplay}
            onChange={(newCurrency) =>
              onChangeTempSettings({ currencyDisplay: newCurrency.name })
            }
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
              /*
              TODO: has-warning class was defined in Modals.less. After the migration to CSS modules, it's now defined in Modals.module.css as hasWarning.
              Please, import this CSS rule to the respective Settings CSS module file and use it here.
              */
              modalClassName="has-warning"
              double
              draggable
            />
            <div className={styles.infoLabel}>
              <T id="settings.gapLimit.label" m="Gap Limit" />
            </div>
          </div>
          <div className={styles.input}>
            <NumericInput
              value={tempSettings.gapLimit}
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
