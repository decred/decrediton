import { ProposalList } from "./Page";
import PoliteiaDisabled from "./PoliteiaDisabled";
import { useSelector, useDispatch } from 'react-redux';
import { setLastPoliteiaAccessTime } from "actions/WalletLoaderActions";
import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import { TabbedPage, TabbedPageTab as Tab } from "layout";
import { createElement as h, useState, useEffect, useReducer } from "react";
import * as sel from "selectors";

const PageHeader = () => (
  <div className="proposals-community-header is-row">
    <div className="proposals-community-header-wrapper">
      <div className="proposals-community-header-title"><T id="proposals.community.title" m="Proposals"/></div>
      <div className="proposals-community-header-description">
        <T id="proposals.community.descr"
          m="Voting on community proposals allows you to have a say on how the project treasury is spent.
          Participation in voting requires (PoS) tickets. Proposal creation, discussions and other features are available at {link}"
          values={{ link: <PiLink className="proposals-link">proposals.decred.org</PiLink> }} />
      </div>
    </div>
    <div className="links">
      <PiLink><T id="proposals.community.createLink" m="Create a Proposal" /></PiLink>
    </div>
  </div>
);

const ListLink = ({ count, children }) => (
  <>
    {children}
    { count ? <span className="proposal-list-link-count">{count}</span> : null }
  </>
);

function getProposalsTab(location) {
  const { pathname } = location;
  if (pathname.includes("prevote")) {
    return "preVote";
  }
  if (pathname.includes("activevote")) {
    return "activeVote";
  }
  if (pathname.includes("voted")) {
    return "finishedVote";
  }
  if (pathname.includes("abandoned")) {
    return "abandonedVote";
  }
}

function Proposals() {
  const dispatch = useDispatch();
  const {
    inventory, activeVoteCount, preVoteCount, location, politeiaEnabled, proposalsList
  } = useSelector(state => ({
    politeiaEnabled: sel.politeiaEnabled(state),
    inventory: sel.inventory(state),
    activeVoteCount: sel.newActiveVoteProposalsCount(state),
    preVoteCount: sel.newPreVoteProposalsCount(state),
    location: sel.location(state),
    proposalsList: sel.proposals(state)
  }));
  if (!politeiaEnabled) {
    return <PoliteiaDisabled />;
  }
  const [ tab, setTab ] = useReducer(() => getProposalsTab(location));
  useEffect(() => {
    dispatch(setLastPoliteiaAccessTime());
  }, []);
  useEffect(() => {
    const tab = getProposalsTab(location);
    setTab(tab)
  }, [location]);

  return (
    <TabbedPage caret={<div/>} header={<PageHeader />} >
      <Tab path="/governance/proposals/prevote"
        component={ h(ProposalList, { tab }) }
        key="preVote"
        link={<ListLink count={preVoteCount}><T id="proposals.statusLinks.preVote" m="In Discussion" /></ListLink> }
      />
      <Tab path="/governance/proposals/activevote"
        component={h(ProposalList, { tab }) }
        key="activevote"
        link={<ListLink count={activeVoteCount}><T id="proposals.statusLinks.underVote" m="Voting" /></ListLink>}
      />
      <Tab path="/governance/proposals/voted"
        component={h(ProposalList, { finishedVote: true, tab }) }
        key="activevote"
        link={<T id="proposals.statusLinks.voted" m="Finished Voting" />} />
      <Tab path="/governance/proposals/abandoned"
        component={h(ProposalList, { tab }) }
        key="abandoned"
        link={<T id="proposals.statusLinks.abandoned" m="Abandoned" />} />
    </TabbedPage>
  )
}

export default Proposals;
