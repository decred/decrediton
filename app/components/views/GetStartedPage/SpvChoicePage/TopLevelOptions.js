import { FormattedMessage as T } from "react-intl";

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
      <T id="spv.titleSub" m={"Select how Decrediton wallet's should connect to the network. You can change this in the application settings later."}/>
    </div>
    <div className="privacy-options">
      <PrivacyOption
        title={<T id="spv.options.enable.title" m="Enable SPV" />}
        icon="enable-spv"
        description={<T id="spv.options.enable.description" m="SPV will allow your wallets to be restored and used much more quickly." />}
        onClick={enableSpv}
      />

      <PrivacyOption
        title={<T id="spv.options.disable.title" m="Disable SPV" />}
        icon="disable-spv"
        description={<T id="spv.options.disable.description" m="This will use the regular Decred Daemon and fully verify blocks.  This will take longer, but is more secure." />}
        onClick={disableSpv}
      />

    </div>
  </Aux>
);
