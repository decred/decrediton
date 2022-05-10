import { FormattedMessage as T } from "react-intl";
import { SettingsInput } from "inputs";
import styles from "./MiscSettings.module.css";
import { DiscoverUsageModal } from "modals";
import { KeyBlueButton } from "buttons";
import { useSettings } from "hooks";
import { Label, Box } from "../../helpers";

const MiscSettings = ({ tempSettings, currencies, onChangeTempSettings }) => {
  const {
    onDiscoverUsage,
    gapLimit,
    setGapLimit,
    isValid,
    clicked,
    isDiscoverModalVisible,
    showDiscoverModal,
    hideDiscoverModal,
    discoverUsageAttempt,
    rescanRunning
  } = useSettings();

  return (
    <Box className={styles.box}>
      <div>
        <Label id="displayed-units-input">
          <T id="settings.displayedUnits" m="Displayed Units" />
        </Label>
        <SettingsInput
          selectWithBigFont
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
      <div className="justify-space-between">
        <div>
          <Label id="address-usage">
            <T id="settings.addressUsage" m="Address Usage" />
          </Label>
          <KeyBlueButton
            className={styles.discoverUsageButton}
            onClick={showDiscoverModal}
            loading={discoverUsageAttempt || rescanRunning}
            disabled={discoverUsageAttempt || rescanRunning}>
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
      </div>
    </Box>
  );
};

MiscSettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

export default MiscSettings;
