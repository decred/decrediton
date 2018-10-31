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
      <T id="spv.titleSub" m={"Select how Decrediton should connect to external services. You can change this in the application settings later."}/>
    </div>
    <div className="privacy-options">
      <PrivacyOption
        title={<T id="spv.options.enable.title" m="Enable SPV" />}
        icon="enable-spv"
        description={<T id="spv.options.enable.description" m="Enables connections to most services for a better user experience and full access to features (such as version update, stakepool listing, politeia, etc). Recommended for most users." />}
        onClick={enableSpv}
      />

      <PrivacyOption
        title={<T id="spv.options.disable.title" m="Disable SPV" />}
        icon="disable-spv"
        description={<T id="spv.options.disable.description" m="Disables all connections to third party (non-dcrd/non-dcrwallet) services. This may prevent you from using certain features of the app. Recommended for advanced users." />}
        onClick={disableSpv}
      />

    </div>
  </Aux>
);
