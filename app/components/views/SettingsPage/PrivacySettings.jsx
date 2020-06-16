import { FormattedMessage as T } from "react-intl";
import {
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_UPDATE_CHECK,
  EXTERNALREQUEST_POLITEIA,
  EXTERNALREQUEST_DCRDATA
} from "main_dev/externalRequests";

import { ChangePassphraseButton } from "buttons";
import { WatchOnlyWarnNotification } from "shared";

const propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onAttemptChangePassphrase: PropTypes.func,
  isChangePassPhraseDisabled: PropTypes.bool.isRequired,
  changePassphraseRequestAttempt: PropTypes.bool.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

const AllowableRequestType = ({
  id,
  label,
  description,
  checked,
  onChange
}) => (
  <div className="settings-row settings-row-checklist">
    <div className="settings-label">{label}</div>
    <div className="privacy-checkbox">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} />
      <label htmlFor={id}></label>
    </div>
    <div className="settings-checklist-description">{description}</div>
  </div>
);

const PrivacySettings = ({
  tempSettings,
  isChangePassPhraseDisabled,
  changePassphraseRequestAttempt,
  onAttemptChangePassphrase,
  onChangeTempSettings
}) => {
  const toggle = (value) => () => {
    const allowedExternalRequests = [...tempSettings.allowedExternalRequests];
    const idx = allowedExternalRequests.indexOf(value);
    if (idx > -1) {
      allowedExternalRequests.splice(idx, 1);
    } else {
      allowedExternalRequests.push(value);
    }
    onChangeTempSettings({ allowedExternalRequests });
  };

  return (
    <div className="settings-privacy">
      <div className="settings-column-content">
        <div className="settings-row settings-row-checklist">
          <div
            disabled={isChangePassPhraseDisabled}
            className="settings-update-passphrase-button">
            <T
              id="settings.updatePrivatePassphrase"
              m="Update Private Passphrase"
            />
            <WatchOnlyWarnNotification isActive={isChangePassPhraseDisabled}>
              <ChangePassphraseButton
                className={[
                  isChangePassPhraseDisabled
                    ? "change-password-disabled-icon"
                    : "",
                  changePassphraseRequestAttempt
                    ? "change-password-loading"
                    : ""
                ].join(" ")}
                isDisabled={isChangePassPhraseDisabled}
                modalTitle={
                  <T
                    id="settings.changeConfirmation"
                    m="Change your passphrase"
                  />
                }
                onSubmit={onAttemptChangePassphrase}
              />
            </WatchOnlyWarnNotification>
          </div>
        </div>

        <AllowableRequestType
          label={<T id="settings.privacy.updateCheck.label" m="Update Check" />}
          id="update"
          description={
            <T
              id="settings.privacy.updateCheck.description"
              m="Get latest released version from github.org"
            />
          }
          checked={
            tempSettings.allowedExternalRequests.indexOf(
              EXTERNALREQUEST_UPDATE_CHECK
            ) > -1
          }
          onChange={toggle(EXTERNALREQUEST_UPDATE_CHECK)}
        />
        <AllowableRequestType
          label={
            <T
              id="settings.privacy.networkStatus.label"
              m="Network Information"
            />
          }
          id="networking"
          description={
            <T
              id="settings.privacy.networkStatus.description"
              m="General network information (block height, etc) from decred.org"
            />
          }
          checked={
            tempSettings.allowedExternalRequests.indexOf(
              EXTERNALREQUEST_NETWORK_STATUS
            ) > -1
          }
          onChange={toggle(EXTERNALREQUEST_NETWORK_STATUS)}
        />
        <AllowableRequestType
          label={<T id="settings.privacy.politeia.label" m="Politeia" />}
          id="politeia"
          description={
            <T
              id="settings.privacy.politeia.description"
              m="List and vote on proposals on proposals.decred.org"
            />
          }
          checked={
            tempSettings.allowedExternalRequests.indexOf(
              EXTERNALREQUEST_POLITEIA
            ) > -1
          }
          onChange={toggle(EXTERNALREQUEST_POLITEIA)}
        />
        <AllowableRequestType
          label={
            <T id="settings.privacy.stakepoolListing.label" m="VSP Listing" />
          }
          id="stakepool"
          description={
            <T
              id="settings.privacy.stakepoolListing.description"
              m="List of currently available VSPs from decred.org"
            />
          }
          checked={
            tempSettings.allowedExternalRequests.indexOf(
              EXTERNALREQUEST_STAKEPOOL_LISTING
            ) > -1
          }
          onChange={toggle(EXTERNALREQUEST_STAKEPOOL_LISTING)}
        />
        <AllowableRequestType
          label={
            <T id="settings.privacy.dcrdata.label" m="Decred Block Explorer" />
          }
          id="dcrdata"
          description={
            <T
              id="settings.privacy.dcrdata.description"
              m="Access chain information from dcrdata.decred.org"
            />
          }
          checked={
            tempSettings.allowedExternalRequests.indexOf(
              EXTERNALREQUEST_DCRDATA
            ) > -1
          }
          onChange={toggle(EXTERNALREQUEST_DCRDATA)}
        />
      </div>
    </div>
  );
};

PrivacySettings.propTypes = propTypes;

export default PrivacySettings;
