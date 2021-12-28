import { FormattedMessage as T } from "react-intl";
import PrivacySettings from "views/SettingsPage/PrivacyandSecuritySettingsTab/PrivacySettings";
import { InvisibleButton, KeyBlueButton } from "buttons";
import { Title, SubTitle } from "../../helpers";
import styles from "./CustomPrivacyOptions.module.css";

export default ({ toggleCustomPrivacy, acceptCustomPrivacy, ...props }) => (
  <>
    <Title>
      <T id="privacy.custom.title" m="Custom Privacy Options" />
    </Title>
    <SubTitle>
      <T
        id="privacy.custom.titleSub"
        m="Select which external requests Decrediton is allowed to make. You can change this later on the app settings page."
      />
    </SubTitle>
    <div className={styles.customPrivacySettings}>
      <PrivacySettings {...props} />
      <div className={styles.privacyButtons}>
        <InvisibleButton onClick={toggleCustomPrivacy}>
          <T id="privacy.custom.cancel" m="Cancel" />
        </InvisibleButton>
        <KeyBlueButton onClick={acceptCustomPrivacy}>
          <T id="privacy.custom.accept" m="Accept" />
        </KeyBlueButton>
      </div>
    </div>
  </>
);
