import { FormattedMessage as T } from "react-intl";
import { ExternalLink } from "shared";

const PrivacyOption = ({ title, description, icon, onClick }) => (
  <div className="privacy-option" onClick={onClick}>
    <div className={[ "privacy-option-icon", icon ].join(" ")} />
    <div className="privacy-option-title">
      {title}
    </div>
    <div className="privacy-option-description">
      {description}
    </div>
  </div>
);

export default ({ enableSpv, disableSpv }) => (
  <Aux>
    <div className="language-select-title">
      <T id="spv.title" m={"Simple Payment Verification (SPV)"}/>
    </div>
    <div className="language-select-title-sub">
      <T id="spv.titleSub" m={"Select how Decrediton wallet's should connect to the network. You can change this in the application settings later. For more in-depth information about SPV and how it works, you can go "}/>
      <ExternalLink href={"https://docs.decred.org/wallets/spv/"}><T id="spv.titleSub.here" m="here"/></ExternalLink>.
    </div>
    <div className="privacy-options">
      <PrivacyOption
        title={<T id="spv.options.enable.title" m="Enable SPV" />}
        icon="enable-spv"
        description={<T id="spv.options.enable.description" m="SPV will allow your wallets to be restored and used much more quickly.  This speed comes at cost, with blocks not being fully verified.  It's 'less secure' but very unlikely that there will be any problems." />}
        onClick={enableSpv}
      />

      <PrivacyOption
        title={<T id="spv.options.disable.title" m="Disable SPV" />}
        icon="disable-spv"
        description={<T id="spv.options.disable.description" m="This will use the regular Decred Daemon and fully verify blocks.  This will take longer, but is fully secure.  Any block or mined transaction can be fully trusted." />}
        onClick={disableSpv}
      />

    </div>
  </Aux>
);
