import { FormattedMessage as T } from "react-intl";
import PrivacySettings from "views/SettingsPage/SettingsTab/PrivacySettings";
import { InvisibleButton, KeyBlueButton } from "buttons";
import styles from "../GetStarted.module.css";

export default ({ toggleCustomPrivacy, acceptCustomPrivacy, ...props }) => (
  <>
    <div className={styles.title}>
      <T id="privacy.custom.title" m={"Custom Privacy Options"} />
    </div>
    <div className={styles.titleSub}>
      <T
        id="privacy.custom.titleSub"
        m={
          "Select which external requests Decrediton is allowed to make. You can change this later on the app settings page."
        }
      />
    </div>
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
