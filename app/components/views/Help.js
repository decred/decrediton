import { FormattedMessage as T } from "react-intl";
import { TabbedHeader, Tooltip } from "shared";
import { HelpLink, HelpLinkInfoModal from "buttons";
import { ConstitutionModalContent } from "modals";
import "style/Help.less";

const Help = ({ routes }) => (
  <Aux>
    <TabbedHeader {... { routes }}/>
    <div className="page-content">
      <div className={"help-icon-row"}>
        <HelpLink className={"help-github-icon"} href="https://github.com/decred/decrediton"><T id="help.github" m="Github" /></HelpLink>
        <HelpLink className={"help-docs-icon"} href="https://docs.decred.org/"><T id="help.documentation" m="Documentation" /></HelpLink>
        <HelpLink className={"help-stakepools-icon"} href="https://decred.org/#modalOpen"><T id="help.stakepools" m=" Stakepools" /></HelpLink>
        <HelpLink className={"help-rocketchat-icon"} href="https://rocketchat.decred.org"><T id="help.rocketchat" m="RocketChat" /></HelpLink>
      </div>
      <div className={"help-icon-row"}>
        <Tooltip text={ <T id="help.matrix.info" m="Use matrix.decred.org as your custom server URL." /> }><HelpLink className={"help-matrix-icon"} href="https://riot.im/app/#/login"><T id="help.matrix" m="Matrix Chat" /></HelpLink></Tooltip>
        <HelpLink className={"help-freenode-icon"} href="https://webchat.freenode.net/?channels=decred&uio=d4"><T id="help.freenode" m="Freenode" /></HelpLink>
        <HelpLink className={"help-forum-icon"} href="https://forum.decred.org"><T id="help.forum" m="Forum" /> </HelpLink>
        <HelpLinkInfoModal className={"help-constitution-icon"}
          modalTitle={<h1><T id="help.constitution.modal.title" m="Decred Constitution" /></h1>}
          modalContent={<ConstitutionModalContent />}
        >
          <T id="help.constitution" m="Constitution" />
        </HelpLinkInfoModal>
      </div>
    </div>
  </Aux>
);

export default Help;
