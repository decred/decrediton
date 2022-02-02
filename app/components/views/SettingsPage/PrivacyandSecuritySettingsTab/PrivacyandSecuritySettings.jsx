import { FormattedMessage as T } from "react-intl";
import PrivacySettings from "./PrivacySettings";
import PrivatePassphraseSettings from "./PrivatePassphraseSettings";
import { Subtitle } from "shared";
import styles from "./PrivacyandSecuritySettings.module.css";
import { Wrapper, Group } from "../helpers";
import { classNames } from "pi-ui";

const PrivacyandSecuritySettings = ({
  tempSettings,
  onChangeTempSettings,
  onAttemptChangePassphrase,
  isChangePassPhraseDisabled,
  changePassphraseRequestAttempt,
  walletReady,
  wrapperClassName,
  boxClassName
}) => (
  <Wrapper className={classNames(wrapperClassName, styles.wrapper)}>
    {walletReady && (
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
    )}

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
          onChangeTempSettings,
          boxClassName
        }}
      />
    </Group>
  </Wrapper>
);

PrivacyandSecuritySettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired,
  onAttemptChangePassphrase: PropTypes.func,
  isChangePassPhraseDisabled: PropTypes.bool.isRequired,
  changePassphraseRequestAttempt: PropTypes.bool.isRequired,
  walletReady: PropTypes.bool.isRequired,
  wrapperClassName: PropTypes.string,
  boxClassName: PropTypes.string
};

export default PrivacyandSecuritySettings;
