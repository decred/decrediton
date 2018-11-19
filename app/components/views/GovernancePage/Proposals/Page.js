import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import { ActiveVoteProposals, PreVoteProposals, VotedProposals } from "./ProposalList";
import { shell } from "electron";
import { TabbedPage, TabbedPageTab as Tab } from "layout";

const PageHeader = () => (
  <div className="proposals-community-header">
    <div className="proposals-community-header-title"><T id="proposals.community.title" m="Proposals"/></div>
    <p className="proposals-community-header-description"><T id="proposals.community.descr" m="Voting on community proposals allows you to have a say on how the project treasury is spent.
        Participation in voting requires (PoS) tickets. Proposal creation, discussions and other features are available at" /> <a onClick={() => shell.openExternal("https://proposals.decred.org")}>proposals.decred.org</a></p>

    <div className="links">
      <PiLink><T id="proposals.community.createLink" m="Create a Proposal" /></PiLink>
    </div>
  </div>
);

const Page = () => (
  <TabbedPage header={<PageHeader />} >
    <Tab path="/governance/proposals/prevote" component={PreVoteProposals} link={<T id="proposals.statusLinks.preVote" m="Under Discussion" />}/>
    <Tab path="/governance/proposals/activevote" component={ActiveVoteProposals} link={<T id="proposals.statusLinks.underVote" m="Under Vote" />} />
    <Tab path="/governance/proposals/voted" component={VotedProposals} link={<T id="proposals.statusLinks.voted" m="Finished voting" />}/>
  </TabbedPage>
);

export default Page;
