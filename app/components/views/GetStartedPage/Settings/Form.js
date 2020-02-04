import GeneralSettings from "views/SettingsPage/GeneralSettings";
import PrivacySettings from "views/SettingsPage/PrivacySettings";
import ProxySettings from "views/SettingsPage/ProxySettings";
import UIThemeSettings from "views/SettingsPage/UIThemeSettings";
import { Tooltip, Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import { GoBackMsg } from "../messages";

export default ({
  areSettingsDirty,
  tempSettings,
  networks,
  currencies,
  locales,
  onChangeTempSettings,
  onSaveSettings,
  onSendBack,
  getWalletReady
}) => (
  <>
    <div className="go-back-screen-button-area">
      <Tooltip text={ <GoBackMsg /> }><div className="go-back-screen-button" onClick={onSendBack}/></Tooltip>
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
        onClick={() => {onSaveSettings(tempSettings); onSendBack();}}>
        <T id="getStarted.settings.save" m="Save" />
      </KeyBlueButton>
    </div>
  </>
);
