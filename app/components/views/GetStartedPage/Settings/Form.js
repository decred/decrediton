import GeneralSettings from "views/SettingsPage/GeneralSettings";
import { KeyBlueButton, SlateGrayButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import "style/StakePool.less";
import "style/Settings.less";

export default ({
  areSettingsDirty,
  tempSettings,
  networks,
  currencies,
  locales,
  onChangeTempSettings,
  onSaveSettings,
  onHideSettings
}) => (
  <div className="get-started-content-new-seed get-started-settings">
    <GeneralSettings {...{tempSettings, networks, currencies, locales,
      onChangeTempSettings}} />

    <div className="get-started-bottom-buttons">
      <SlateGrayButton onClick={onHideSettings}>
        <T id="getStarted.btnHideSettings" m="Back" />
      </SlateGrayButton>

      <KeyBlueButton
        disabled={!areSettingsDirty}
        size="large"
        block={false}
        onClick={() => onSaveSettings(tempSettings)}>
        <T id="settings.save" m="Save" />
      </KeyBlueButton>
    </div>

  </div>
);
