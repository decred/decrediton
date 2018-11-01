import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import { Switch, Route, NavLink } from "react-router-dom";
import { ActiveVoteProposals, PreVoteProposals, VotedProposals } from "./ProposalList";
import { shell } from "electron";

const Page = () => (
  <Aux>
    <div className="proposals-community-header">
      <div className="proposals-community-header-title"><T id="proposals.community.title" m="Proposals"/></div>
      <p className="proposals-community-header-description"><T id="proposals.community.descr" m="Voting on community proposals allows you to have a say on how the project treasury is spent.
          Participation in voting requires (PoS) tickets. Proposal creation, discussions and other features are available at" /> <a onClick={() => shell.openExternal("https://proposals.decred.org")}>proposals.decred.org</a></p>

      <div className="links">
        <PiLink><T id="proposals.community.createLink" m="Create a Proposal" /></PiLink>
      </div>
    </div>

    <div className="proposals-status-links">
      <NavLink to="/governance/proposals/prevote"><T id="proposals.statusLinks.preVote" m="Under Discussion" /></NavLink>
      <NavLink to="/governance/proposals/activevote"><T id="proposals.statusLinks.underVote" m="Under Vote" /></NavLink>
      <NavLink to="/governance/proposals/voted"><T id="proposals.statusLinks.voted" m="Finished voting" /></NavLink>
    </div>

    <Switch>
      <Route path="/governance/proposals/prevote" component={PreVoteProposals} />
      <Route path="/governance/proposals/activevote" component={ActiveVoteProposals} />
      <Route path="/governance/proposals/voted" component={VotedProposals} />
    </Switch>

  </Aux>
);

export default Page;
