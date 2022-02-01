import { FormattedMessage as T } from "react-intl";
import { SettingsInput } from "inputs";
import styles from "./MiscSettings.module.css";
import { DiscoverUsageModal } from "modals";
import { KeyBlueButton } from "buttons";
import { useSettings } from "hooks";
import { Row, Label, ColumnTitle } from "../../helpers";

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
    hideDiscoverModal,
    discoverUsageAttempt,
    rescanRunning
  } = useSettings();

  return (
    <>
      <ColumnTitle title={<T id="settings.misc.title" m="Misc" />} />
      <div>
        {walletReady && (
          <Row>
            <Label id="displayed-units-input">
              <T id="settings.displayedUnits" m="Displayed Units" />
            </Label>
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
          </Row>
        )}

        {walletReady && (
          <Row>
            <KeyBlueButton
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
          </Row>
        )}
      </div>
    </>
  );
};

MiscSettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired,
  walletReady: PropTypes.bool.isRequired
};

export default MiscSettings;
