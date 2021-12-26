import { FormattedMessage as T } from "react-intl";
import {
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_UPDATE_CHECK,
  EXTERNALREQUEST_POLITEIA,
  EXTERNALREQUEST_DCRDATA
} from "constants";
import { Checkbox } from "pi-ui";
import styles from "./PrivacySettings.module.css";
import { Box } from "../../helpers";

const PrivacySettings = ({ tempSettings, onChangeTempSettings }) => {
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
    <Box className={styles.box}>
      <div>
        <Checkbox
          className={styles.privacyCheckbox}
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
      </div>
      <div>
        <Checkbox
          className={styles.privacyCheckbox}
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
      <div>
        <Checkbox
          className={styles.privacyCheckbox}
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
      </div>
      <div>
        <Checkbox
          className={styles.privacyCheckbox}
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
      </div>
      <div>
        <Checkbox
          className={styles.privacyCheckbox}
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
      </div>
    </Box>
  );
};

PrivacySettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired
};

export default PrivacySettings;
