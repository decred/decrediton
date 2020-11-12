import { FormattedMessage as T } from "react-intl";
import { ExternalLink } from "shared";
import PrivacyOption from "../PrivacyPage/PrivacyOption";
import styles from "../GetStarted.module.css";

export default ({ toggleSpv }) => (
  <>
    <div className={styles.title}>
      <T id="spv.title" m={"Simple Payment Verification (SPV)"} />
    </div>
    <div className={styles.titleSub}>
      <T
        id="spv.titleSub"
        m={
          "Select how Decrediton should connect to the Decred network. You can change this in the application settings later. For more in-depth information about SPV and how it works, you can go {link}"
        }
        values={{
          link: (
            <ExternalLink href={"https://docs.decred.org/wallets/spv/"}>
              <T id="spv.titleSub.here" m="here" />
            </ExternalLink>
          )
        }}
      />
    </div>
    <div className={styles.privacyOptions}>
      <PrivacyOption
        title={<T id="spv.options.enable.title" m="Enable SPV" />}
        icon="enable-spv"
        description={
          <T
            id="spv.options.enable.description"
            m="SPV will allow your wallets to be restored and used much more quickly.  This speed comes at cost, with blocks not being fully verified.  It's 'less secure' but very unlikely that there will be any problems."
          />
        }
        onClick={() => toggleSpv(true)}
      />

      <PrivacyOption
        title={<T id="spv.options.disable.title" m="Disable SPV" />}
        icon="disable-spv"
        description={
          <T
            id="spv.options.disable.description"
            m="This will use the regular Decred daemon and fully verify blocks.  This will take longer but is fully secure.  Any block or mined transaction can be fully trusted."
          />
        }
        onClick={() => toggleSpv(false)}
      />
    </div>
  </>
);
