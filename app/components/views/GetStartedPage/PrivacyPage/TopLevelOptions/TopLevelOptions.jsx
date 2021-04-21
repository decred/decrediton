import { FormattedMessage as T } from "react-intl";
import PrivacyOption from "../PrivacyOption";
import PrivacyOptions from "../PrivacyOptions";
import { Title, SubTitle } from "../../helpers";
import styles from "./TopLevelOptions.module.css";

const TopLevelOptions = ({
  setupStandardPrivacy,
  setupDisabledPrivacy,
  toggleCustomPrivacy
}) => (
  <>
    <Title>
      <T id="privacy.title" m="Privacy Options" />
    </Title>
    <SubTitle>
      <T
        id="privacy.titleSub"
        m="Select how Decrediton should connect to external services. You can change this in the application settings later."
      />
    </SubTitle>
    <PrivacyOptions className={styles.wide}>
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
        className={styles.option}
        iconClassName={styles.icon}
        textClassName={styles.textContainer}
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
        className={styles.option}
        iconClassName={styles.icon}
        textClassName={styles.textContainer}
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
        className={styles.option}
        iconClassName={styles.icon}
        textClassName={styles.textContainer}
      />
    </PrivacyOptions>
  </>
);

export default TopLevelOptions;
