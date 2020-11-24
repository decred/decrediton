import { FormattedMessage as T } from "react-intl";
import PrivacyOption from "./PrivacyOption";
import { classNames } from "pi-ui";
import styles from "../GetStarted.module.css";

export default ({
  setupStandardPrivacy,
  setupDisabledPrivacy,
  toggleCustomPrivacy
}) => (
  <>
    <div className={styles.title}>
      <T id="privacy.title" m={"Privacy Options"} />
    </div>
    <div className={styles.titleSub}>
      <T
        id="privacy.titleSub"
        m={
          "Select how Decrediton should connect to external services. You can change this in the application settings later."
        }
      />
    </div>
    <div className={classNames(styles.privacyOptions, styles.wide)}>
      <PrivacyOption
        title={<T id="privacy.options.standard.title" m="Standard" />}
        icon="standard"
        description={
          <T
            id="privacy.options.standard.description"
            m="Enables connections to most services for a better user experience and full access to features (such as version update, VSP listing, Politeia, etc). Recommended for most users."
          />
        }
        onClick={setupStandardPrivacy}
      />

      <PrivacyOption
        title={
          <T id="privacy.options.disabled.title" m="No Outbound Connections" />
        }
        icon="disabled"
        description={
          <T
            id="privacy.options.disabled.description"
            m="Disables all connections to third party (non-dcrd/non-dcrwallet) services. This may prevent you from using certain features of the app. Recommended for advanced users."
          />
        }
        onClick={setupDisabledPrivacy}
      />

      <PrivacyOption
        title={
          <T
            id="privacy.options.custom.title"
            m="Customize Allowed Connections"
          />
        }
        icon="custom"
        description={
          <T
            id="privacy.options.custom.description"
            m="Allows you to choose exactly which third party services can be accessed by the app."
          />
        }
        onClick={toggleCustomPrivacy}
      />
    </div>
  </>
);
