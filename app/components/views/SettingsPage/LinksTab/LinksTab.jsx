import { FormattedMessage as T } from "react-intl";
import { HelpLink, HelpLinkInfoModal, HelpLinkAboutModal } from "buttons";
import { Subtitle } from "shared";
import styles from "./LinksTab.module.css";

const LinksTab = () => (
  <>
    <Subtitle title={<T id="help.subtitle.project" m="Project Related" />} />
    <div className={styles.list}>
      <HelpLink
        icon="docs"
        href="https://docs.decred.org/"
        title={<T id="help.documentation" m="Documentation" />}
        subtitle={<T id="help.documentation.subtitle" m="docs.decred.org" />}
      />
      <HelpLink
        icon="pools"
        href="https://decred.org/stakepools"
        title={<T id="help.stakepools" m=" VSPs" />}
        subtitle={<T id="help.stakepools.subtitle" m="decred.org/vsp" />}
      />
      <HelpLink
        icon="explorer"
        href="https://dcrdata.decred.org"
        title={<T id="help.blockchain" m=" Blockchain Explorer" />}
        subtitle={<T id="help.blockchain.subtitle" m="dcrdata.decred.org" />}
      />
      <HelpLink
        icon="github"
        href="https://github.com/decred/decrediton"
        title={<T id="help.github.title" m="GitHub" />}
        subtitle={
          <T id="help.github.subtitle" m="github.com/decred/decrediton" />
        }
      />
      <HelpLinkInfoModal
        document="DecredConstitution"
        icon="constitution"
        title={<T id="help.constitution" m="Constitution" />}
        subtitle={
          <T id="help.constitution.subtitle" m="Decred Project Constitution" />
        }
        double
      />
      <HelpLinkAboutModal
        icon="star"
        title={<T id="help.about.decrediton" m="About Decrediton" />}
        subtitle={
          <T id="help.about.decrediton.subtitle" m="Software Summary" />
        }
      />
    </div>
    <Subtitle
      title={<T id="help.subtitle.communications" m="Communications" />}
    />
    <div className={styles.list}>
      <HelpLink
        icon="matrix"
        href="https://chat.decred.org/"
        title={<T id="help.matrix" m="Matrix Chat" />}
        subtitle={<T id="help.matrix.subtitle" m="chat.decred.org" />}
      />
      <HelpLink
        icon="forum"
        href="https://t.me/Decred"
        title={<T id="help.telegram" m="Telegram" />}
        subtitle={<T id="help.telegram.subtitle" m="t.me/Decred" />}
      />
    </div>
  </>
);

export default LinksTab;
