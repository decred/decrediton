import KeyBlueButton from "KeyBlueButton";
import { FormattedMessage as T } from "react-intl";
import { TabbedHeader } from "shared";
import ChangePassphraseModal from "ChangePassphraseModal";
import GeneralSettings from "./GeneralSettings";
import "style/StakePool.less";
import "style/Settings.less";

const SettingsPage = ({
                        areSettingsDirty,
                        tempSettings,
                        networks,
                        currencies,
                        locales,
                        isShowingChangePassphrase,
                        onShowChangePassphrase,
                        onCancelChangePassphrase,
                        onAttemptChangePassphrase,
                        onChangeTempSettings,
                        onSaveSettings,
                        routes,
                      }) => (
  <Aux>
    <TabbedHeader {...{ routes }}/>
    <div className="tabbed-page">
      <ChangePassphraseModal
        hidden={!isShowingChangePassphrase}
        updatePassphrase={onAttemptChangePassphrase}
        cancelPassphrase={onCancelChangePassphrase}
      />
      <div className={ ["tab-card", isShowingChangePassphrase ? "tab-card-blur" : null].join(" ").trim() }>
        <div className="settings-wrapper">
          <GeneralSettings {...{tempSettings, networks, currencies, locales,
            onChangeTempSettings}} />

          <div className="settings-security">
            <div className="settings-colunm-title">Security</div>
            <div className="settings-action-buttons">
              <div className="settings-update-passphrase-button">
                <T id="settings.updatePrivatePassphrase" m="Update Private Passphrase" />
                <button
                  className="change-password-default-icon"
                  onClick={onShowChangePassphrase}
                >
                </button>
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

      </div>

    </div>
  </Aux>
);

export default SettingsPage;
