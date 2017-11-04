import { FormattedMessage as T } from "react-intl";
import { TabbedHeader } from "shared";
import HelpLink from "HelpLink";
import "style/Help.less";

const Help = () => (
  <div className="page-view">
    <TabbedHeader/>
    <div className="page-content">
      <div className={"help-icon-row"}>
        <HelpLink className={"help-github-icon"} href="https://github.com/decred/decrediton"><T id="help.github" m="Github" /></HelpLink>
        <HelpLink className={"help-docs-icon"} href="https://docs.decred.org/"><T id="help.documentation" m="Documentation" /></HelpLink>
        <HelpLink className={"help-stakepools-icon"} href="https://decred.org/#modalOpen"><T id="help.stakepools" m=" Stakepools" /></HelpLink>
      </div>
      <div className={"help-icon-row"}>
        <HelpLink className={"help-freenode-icon"} href="https://webchat.freenode.net/?channels=decred&uio=d4"><T id="help.freenode" m="Freenode" /></HelpLink>
        <HelpLink className={"help-forum-icon"} href="https://forum.decred.org"><T id="help.forum" m="Forum" /> </HelpLink>
      </div>
    </div>
  </div>
);

export default Help;
