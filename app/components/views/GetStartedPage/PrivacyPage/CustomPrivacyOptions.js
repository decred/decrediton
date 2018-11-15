import { FormattedMessage as T } from "react-intl";
import PrivacySettings from "views/SettingsPage/PrivacySettings";
import { InvisibleButton, KeyBlueButton } from "buttons";

export default ({ cancelCustomPrivacy, acceptCustomPrivacy, ...props }) => (
  <Aux>
    <div className="language-select-title">
      <T id="privacy.custom.title" m={"Custom Privacy Options"}/>
    </div>
    <div className="language-select-title-sub">
      <T id="privacy.custom.titleSub" m={"Select which external requests Decrediton is allowed to make. You can change this later on the app settings page."}/>
    </div>
    <div className="get-started-custom-privacy-settings" >
      <PrivacySettings {...props} />
      <div className="privacy-buttons">
        <InvisibleButton onClick={cancelCustomPrivacy}>
          <T id="privacy.custom.cancel" m="Cancel" />
        </InvisibleButton>
        <KeyBlueButton onClick={acceptCustomPrivacy}>
          <T id="privacy.custom.accept" m="Accept" />
        </KeyBlueButton>
      </div>
    </div>
  </Aux>
);
