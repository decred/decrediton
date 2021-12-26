import { FormattedMessage as T } from "react-intl";
import PrivacySettings from "./PrivacySettings";
import PrivatePassphraseSettings from "./PrivatePassphraseSettings";
import { Subtitle } from "shared";
import styles from "./PrivacyandSecuritySettings.module.css";
import { Wrapper, Group, GroupWrapper } from "../helpers";

const PrivacyandSecuritySettings = ({
  tempSettings,
  onChangeTempSettings,
  onAttemptChangePassphrase,
  isChangePassPhraseDisabled,
  changePassphraseRequestAttempt,
  walletReady
}) => (
  <Wrapper>
    {walletReady && (
      <GroupWrapper>
        <Group>
          <Subtitle
            className={styles.subtitle}
            title={
              <T
                id="settings.getstartpage.group-title.privatePassphrase"
                m="Private Passphrase"
              />
            }
          />
          <PrivatePassphraseSettings
            {...{
              onAttemptChangePassphrase,
              isChangePassPhraseDisabled,
              changePassphraseRequestAttempt
            }}
          />
        </Group>
      </GroupWrapper>
    )}

    <GroupWrapper>
      <Group>
        <Subtitle
          className={styles.subtitle}
          title={
            <T
              id="settings.getstartpage.group-title.privacy-and-security"
              m="Privacy and Security"
            />
          }
        />
        <PrivacySettings
          {...{
            tempSettings,
            onChangeTempSettings
          }}
        />
      </Group>
    </GroupWrapper>
  </Wrapper>
);

PrivacyandSecuritySettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired,
  onAttemptChangePassphrase: PropTypes.func,
  isChangePassPhraseDisabled: PropTypes.bool.isRequired,
  changePassphraseRequestAttempt: PropTypes.bool.isRequired,
  walletReady: PropTypes.bool.isRequired
};

export default PrivacyandSecuritySettings;
