import Header from "Header";
import HelpLink from "HelpLink";
import { FormattedMessage as T } from "react-intl";
import "style/Layout.less";
import "style/Help.less";

class Help extends React.Component{
  render() {
    return (
      <div className="page-view">
        <Header
          headerTitleOverview={<T id="help.title" m="Help" />}
        />
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
  }
}

export default Help;
