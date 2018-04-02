import { FormattedMessage as T } from "react-intl";
import { ExternalLink } from "shared";
import { Switch, Route, NavLink } from "react-router-dom";
import { ActiveVoteProposals, VettedProposals } from "./ProposalList";

export default () => (
  <Aux>
    <div className="proposals-community-descr">
      <h1><T id="proposals.community.title" m="Community Proposals"/></h1>
      <p><T id="proposals.community.descr" m="bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla " /></p>
      <ExternalLink href="https://politeia.com"><T id="proposals.community.allLink" m="All Proposals" /></ExternalLink>
      <ExternalLink href="https://politeia.com"><T id="proposals.community.createLink" m="Create a Proposal" /></ExternalLink>
    </div>

    <div className="proposals-status-links">
      <NavLink to="/governance/proposals/activevote"><T id="proposals.statusLinks.underVote" m="Under Vote" /></NavLink>
      <NavLink to="/governance/proposals/vetted"><T id="proposals.statusLinks.reviewed" m="Reviewed" /></NavLink>
    </div>

    <Switch>
      <Route path="/governance/proposals/activevote" component={ActiveVoteProposals} />
      <Route path="/governance/proposals/vetted" component={VettedProposals} />
    </Switch>

  </Aux>
);
