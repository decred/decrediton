import { FormattedMessage as T } from "react-intl";
import { SettingsInput } from "inputs";
import styles from "./Settings.module.css";
import { DiscoverUsageModal } from "modals";
import { KeyBlueButton } from "buttons";
import { useSettings } from "hooks";

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
}) => {
  const {
    onDiscoverUsage,
    gapLimit,
    setGapLimit,
    isValid,
    clicked,
    isDiscoverModalVisible,
    showDiscoverModal,
    hideDiscoverModal
  } = useSettings();
  return (
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
            <KeyBlueButton onClick={showDiscoverModal}>
              <T id="settings.DiscoverAddressBtn" m="Discover Address Usage" />
            </KeyBlueButton>
            <DiscoverUsageModal
              {...{
                show: isDiscoverModalVisible,
                onSubmit: onDiscoverUsage,
                onCancelModal: hideDiscoverModal,
                gapLimit,
                setGapLimit,
                isValid,
                clicked
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

MiscSettings.propTypes = propTypes;

export default MiscSettings;
