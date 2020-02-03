import NetworkSettings from "views/SettingsPage/NetworkSettings";
import ProxySettings from "views/SettingsPage/ProxySettings";
import PrivacySettings from "views/SettingsPage/PrivacySettings";
import UISettings from "views/SettingsPage/UISettings";
import MiscSettings from "views/SettingsPage/MiscSettings";
import TimezoneSettings from "views/SettingsPage/TimezoneSettings";
import { Tooltip, Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { LoaderBarBottom } from "indicators";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { LogsLinkMsg, SettingsLinkMsg, GoBackMsg, AboutModalButton } from "../messages";
import cx from "classnames";

export default ({
  areSettingsDirty,
  tempSettings,
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
  isTestNet,
  walletReady,
  onAttemptChangePassphrase,
  isChangePassPhraseDisabled,
  changePassphraseRequestAttempt
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
        <div className="settings-group">
          <div className="settings-group-title"><T id="settings.group-title.connectivity" m="Connectivity" /></div>
          <div className="settings-column-wrapper">
            <div className="settings-column">
              <NetworkSettings {...{
                tempSettings,
                onChangeTempSettings
              }} />
            </div>
            <div className="settings-column">
              <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
            </div>
          </div>
        </div>

        <div className="settings-group general">
          <div className="settings-group-title"><T id="settings.group-title.general" m="General" /></div>
          <div className="settings-column-wrapper">
            <div className="settings-column">
              <UISettings {...{ tempSettings, locales, onChangeTempSettings }} />
            </div>
            <div className="settings-column timezone">
              <TimezoneSettings {...{ tempSettings, onChangeTempSettings }} />
            </div>
            {walletReady &&
              <div className="settings-column">
                <MiscSettings {...{ tempSettings, currencies, walletReady, onChangeTempSettings }} />
              </div>
            }
          </div>
        </div>

        <div className="settings-group privacy">
          <div className="settings-group-title"><T id="settings.group-title.privacy-and-security" m="Privacy and Security" /></div>
          <div className="settings-column-wrapper">
            <div className="settings-column">
              <PrivacySettings {...{
                tempSettings, onAttemptChangePassphrase,
                isChangePassPhraseDisabled, onChangeTempSettings, changePassphraseRequestAttempt
              }} />
            </div>
          </div>
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
