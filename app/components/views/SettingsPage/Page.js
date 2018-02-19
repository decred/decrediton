import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader, StandalonePage } from "layout";
import { ChangePassphraseButton, KeyBlueButton } from "buttons";
import GeneralSettings from "./GeneralSettings";
import "style/StakePool.less";
import "style/Settings.less";

const SettingsPageHeader = () =>
  <StandaloneHeader
    title={<T id="settings.title" m="Settings"/>}
    iconClassName="settings"
    description={<T id="settings.description" m="Changing network settings requires a restart"/>}
  />;

const SettingsPage = ({
  areSettingsDirty,
  tempSettings,
  networks,
  currencies,
  locales,
  onChangeTempSettings,
  onSaveSettings,
  onAttemptChangePassphrase,
}) => (
  <StandalonePage header={<SettingsPageHeader />}>
    <div className="settings-wrapper">
      <GeneralSettings {...{ tempSettings, networks, currencies, locales,
        onChangeTempSettings }} />

      <div className="settings-security">
        <div className="settings-column-title"><T id="settings.security.title" m="Security" /></div>
        <div className="settings-action-buttons">
          <div className="settings-update-passphrase-button">
            <T id="settings.updatePrivatePassphrase" m="Update Private Passphrase" />
            <ChangePassphraseButton
              modalTitle={<T id="settings.changeConfirmation" m="Change your passphrase" />}
              onSubmit={onAttemptChangePassphrase} />
          </div>
        </div>
      </div>
    </div>

    <div className="settings-save-button">
      <KeyBlueButton
        disabled={!areSettingsDirty}
        size="large"
        block={false}
        onClick={onSaveSettings}>
        <T id="settings.save" m="Save" />
      </KeyBlueButton>
    </div>
  </StandalonePage>
);

export default SettingsPage;
