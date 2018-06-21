import { FormattedMessage as T } from "react-intl";
import { ExternalLink } from "shared";
import { Switch, Route, NavLink } from "react-router-dom";
import { ActiveVoteProposals, VettedProposals } from "./ProposalList";

const PiLink = ({ children }) => (
  <ExternalLink href="https://proposals.decred.org" hrefTestNet="https://test-proposals.decred.org">
    {children}
  </ExternalLink>
);

const Page = () => (
  <Aux>
    <div className="proposals-community-header">
      <div className="text">
        <h1><T id="proposals.community.title" m="Community Proposals"/></h1>
        <p><T id="proposals.community.descr" m="In this section, you can review community proposals currently under consideration and voting. If you have elligible tickets, you can also vote for these proposals." /></p>
      </div>

      <div className="links">
        <PiLink><T id="proposals.community.allLink" m="All Proposals" /></PiLink>
        <PiLink><T id="proposals.community.createLink" m="Create a Proposal" /></PiLink>
      </div>
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

export default Page;
