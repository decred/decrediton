import GeneralSettings from "views/SettingsPage/GeneralSettings";
import PrivacySettings from "views/SettingsPage/PrivacySettings";
import ProxySettings from "views/SettingsPage/ProxySettings";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { LogsLinkMsg, SettingsLinkMsg, GoBackMsg, AboutModalButton } from "../messages";

export default ({
  areSettingsDirty,
  tempSettings,
  networks,
  currencies,
  locales,
  onChangeTempSettings,
  onSaveSettings,
  onHideSettings,
  onShowLogs,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  appVersion,
  updateAvailable,
  getWalletReady
}) => (
  <div className="page-body getstarted">
    <div className="getstarted loader logs">
      <div className="loader-settings-logs">
        <AboutModalButton { ...{ appVersion, updateAvailable } } />
        <InvisibleButton className="active">
          <SettingsLinkMsg />
        </InvisibleButton>
        <InvisibleButton onClick={onShowLogs}>
          <LogsLinkMsg />
        </InvisibleButton>
      </div>
      <div className="go-back-screen-button-area">
        <Tooltip text={ <GoBackMsg /> }><div className="go-back-screen-button" onClick={onHideSettings}/></Tooltip>
      </div>
      <div className="tabbed-page-subtitle"><T id="settings.subtitle" m="Settings"/></div>
      <div className="settings-wrapper">
        <div className="settings-columns">
          <GeneralSettings {...{ tempSettings, networks, currencies, locales, onChangeTempSettings }} walletReady={getWalletReady}/>
          <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
        </div>
        <div className="settings-columns">
          <PrivacySettings {...{ tempSettings, onChangeTempSettings }} />
        </div>
      </div>
      <KeyBlueButton
        disabled={!areSettingsDirty}
        size="large"
        block={false}
        onClick={() => {onSaveSettings(tempSettings); onHideSettings();}}>
        <T id="getStarted.settings.save" m="Save" />
      </KeyBlueButton>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}  />
    </div>
  </div>
);
