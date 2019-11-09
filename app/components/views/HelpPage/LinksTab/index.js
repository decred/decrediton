import { FormattedMessage as T } from "react-intl";
import { HelpLink, HelpLinkInfoModal, HelpLinkAboutModal } from "buttons";
import { DescriptionHeader } from "layout";
import { Subtitle, Documentation } from "shared";
import "style/Help.less";

export const LinksTabHeader = () =>
  <DescriptionHeader
    description={<T id="help.description.links" m="If you have any difficulty with decrediton, please use the following links to help find a solution." />}
  />;

export const LinksTab = () => (
  <>
    <Subtitle title={<T id="help.subtitle.project" m="Project Related"/>} />
    <div className="help-icons-list">
      <HelpLink className={"help-docs-icon"} href="https://docs.decred.org/" title={<T id="help.documentation" m="Documentation" />} subtitle={<T id="help.documentation.subtitle" m="docs.decred.org"/>}/>
      <HelpLink className={"help-stakepools-icon"} href="https://decred.org/stakepools" title={<T id="help.stakepools" m=" VSPs" />} subtitle={<T id="help.stakepools.subtitle" m="decred.org/vsp"/>}/>
      <HelpLink className={"help-blockchain-explorer-icon"} href="https://dcrdata.decred.org" title={<T id="help.blockchain" m=" Blockchain Explorer" />} subtitle={<T id="help.blockchain.subtitle" m="dcrdata.decred.org"/>}/>
      <HelpLink className={"help-github-icon"} href="https://github.com/decred/decrediton" title={<T id="help.github.title" m="GitHub"/>} subtitle={<T id="help.github.subtitle" m="github.com/decred/decrediton"/>} />
      <HelpLinkInfoModal className={"help-constitution-icon"}
        title={<T id="help.constitution" m="Constitution"/>}
        subtitle={<T id="help.constitution.subtitle" m="Decred Project Constitution"/>}
        modalTitle={<h1><T id="help.constitution.modal.title" m="Decred Constitution" /></h1>}
        modalContent={<Documentation name="DecredConstitution" />}
        double
      />
      <HelpLinkAboutModal className={"help-star-icon"}
        title={<T id="help.about.decrediton" m="About Decrediton"/>}
        subtitle={<T id="help.about.decrediton.subtitle" m="Software Summary"/>}
      />
    </div>
    <Subtitle title={<T id="help.subtitle.communications" m="Communications"/>} />
    <div className="help-icons-list">
      <HelpLink className={"help-matrix-icon"} href="https://decred.org/matrix" title={<T id="help.matrix" m="Matrix Chat" />} subtitle={<T id="help.matrix.subtitle" m="riot.im"/>}/>
      <HelpLink className={"help-slack-icon"} href="https://slack.decred.org" title={<T id="help.slack" m="Slack" />} subtitle={<T id="help.slack.subtitle" m="slack.decred.org"/>}/>
      <HelpLink className={"help-forum-icon"} href="https://t.me/decred" title={<T id="help.telegram" m="Telegram" />} subtitle={<T id="help.telegram.subtitle" m="t.me/decred"/>}/>
    </div>
  </>
);
