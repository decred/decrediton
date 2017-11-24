import KeyBlueButton from "KeyBlueButton";
import { FormattedMessage as T } from "react-intl";
import { TabbedHeader } from "shared";
import ChangePassphraseModal from "ChangePassphraseModal";
import SettingsInput from "inputs/SettingsInput";
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
                        onChangeCurrencyDisplay,
                        onChangeNetwork,
                        onChangeLocale,
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
          <div className="settings-general">

            <div className="settings-colunm-title">General</div>
              <div className="settings-column-content">

                <div className="settings-row">
                  <div className="settings-label">
                    <T id="settings.displayedUnits" m="Displayed Units" />
                  </div>
                  <SettingsInput
                    className="settings-input"
                    value={tempSettings.currencyDisplay}
                    onChange={(newCurrency) => onChangeCurrencyDisplay(newCurrency.name)}
                    valueKey="name" labelKey="name"
                    options={currencies}
                  />
                </div>

                <div className="settings-row">
                  <div className="settings-label">
                    <T id="settings.locale" m="Locale" />
                  </div>
                  <SettingsInput
                    className="settings-input"
                    value={tempSettings.locale}
                    onChange={(newLocale) => onChangeLocale(newLocale.key)}
                    valueKey="key" labelKey="description"
                    options={locales}
                  />
                </div>

                <div className="settings-row">
                  <div className="settings-label">
                    <T id="settings.network" m="Network" />
                  </div>
                  <SettingsInput
                    className="settings-input"
                    value={tempSettings.network}
                    onChange={(newNet) => onChangeNetwork(newNet.name)}
                    valueKey="name" labelKey="name"
                    options={networks}
                  />
                </div>
            </div>
          </div>

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
