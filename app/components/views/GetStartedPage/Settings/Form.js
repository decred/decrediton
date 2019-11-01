import GeneralSettings from "views/SettingsPage/GeneralSettings";
import PrivacySettings from "views/SettingsPage/PrivacySettings";
import ProxySettings from "views/SettingsPage/ProxySettings";
import UIThemeSettings from "views/SettingsPage/UIThemeSettings";
import { Tooltip, Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { LogsLinkMsg, SettingsLinkMsg, GoBackMsg, AboutModalButton } from "../messages";
import cx from "classnames";

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
  getWalletReady,
  isTestNet
}) => (
  <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
    <div className="getstarted loader logs settings">
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
      <Subtitle title={<T id="settings.subtitle" m="Settings"/>} />
      <div className="settings-wrapper">
        <div className="settings-columns">
          <GeneralSettings {...{ tempSettings, networks, currencies, locales, onChangeTempSettings }} walletReady={getWalletReady}/>
          <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
          <UIThemeSettings {...{ tempSettings, onChangeTempSettings }} />
        </div>
        <div className="settings-columns">
          <PrivacySettings {...{ tempSettings, onChangeTempSettings }} />
        </div>
      </div>
      <div className="save-button-wrapper">
        <KeyBlueButton
          disabled={!areSettingsDirty}
          size="large"
          block={false}
          onClick={() => {onSaveSettings(tempSettings); onHideSettings();}}>
          <T id="getStarted.settings.save" m="Save" />
        </KeyBlueButton>
      </div>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft }}  />
    </div>
  </div>
);
