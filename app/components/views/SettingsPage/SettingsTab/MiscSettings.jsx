import { FormattedMessage as T } from "react-intl";
import { SettingsInput } from "inputs";
import { DiscoverUsageButton } from "buttons";
import styles from "./Settings.module.css";
import { classNames } from "pi-ui";

const propTypes = {
  tempSettings: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

const MiscSettings = ({
  tempSettings,
  currencies,
  onChangeTempSettings,
  walletReady,
  onDiscoverUsage
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
          <DiscoverUsageButton
            modalTitle={
              <T id="settings.discoverUsage" m="Discover Address Usage" />
            }
            buttonLabel={
              <T id="settings.discoverUsageBtn" m="Discover Address Usage" />
            }
            modalContent={
              <T
                id="settings.discoverUsageContent"
                m="In some rare circumstances, addresses may not be discovered with the default gap limit of 20.  It's recommended to only use this functionality after trying other options and discussing with Support staff.  And be aware that raising the gap limit above 100 will lead to excessive loading times to complete this request."
              />
            }
            onSubmit={onDiscoverUsage}
          />
        </div>
      )}
    </div>
  </div>
);

MiscSettings.propTypes = propTypes;

export default MiscSettings;
