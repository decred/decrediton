import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import { PreVoteProposals, ActiveVoteProposals, FinishedProposal, AbandonedProposals } from "./Page";
import { TabbedPage, TabbedPageTab as Tab } from "layout";
import { proposals } from "connectors";
import { createElement as h, useState } from "react";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import { useSelector, useDispatch } from 'react-redux'
import * as sel from "selectors";
import { getProposalsAndUpdateVoteStatus } from "actions/GovernanceActions";

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

function ProposalsList (props) {
  const [ current, send ] = useMachine(fetchMachine);
  const { inventory, proposalsList, location, activeVoteCount, preVoteCount } = useSelector(state => ({
    inventory: sel.inventory(state),
    proposalsList: sel.proposals(state),
    location: sel.location(state),
    activeVoteCount: sel.newActiveVoteProposalsCount(state),
    preVoteCount: sel.newPreVoteProposalsCount(state)
  }));
  const dispatch = useDispatch();
  const [ noMoreProposals, setNoMoreProposals ] = useState({
    noMoreProposals: {
      activeVote: false,
      finishedVote: false,
      preVote: false,
      abandonedVote: false
    }
  });

  // TODO: Get proposallistpagesize from politeia's request: /v1/policy
  function onLoadMoreProposals(proposallistpagesize = 20) {
    const tab = getProposalsTab(location);
    if (!proposalsList[tab] || !inventory[tab]) {
      return;
    }

    const proposalLength = proposalsList[tab].length;
    if (proposalLength === inventory[tab].length) {
      setNoMoreProposals({
        noMoreProposals: { ...noMoreProposals, [tab]: true }
      });
      return;
    }
    let proposalNumber;
    if (inventory[tab].length <= proposallistpagesize) {
      proposalNumber = inventory[tab].length;
    } else {
      proposalNumber = proposallistpagesize + proposalLength;
    }

    const proposalBatch = inventory[tab].slice(proposalLength, proposalNumber);
    dispatch(getProposalsAndUpdateVoteStatus(proposalBatch));
  }

  return (
    <TabbedPage onChange={onLoadMoreProposals} caret={<div/>} header={<PageHeader />} >
      <Tab path="/governance/proposals/prevote"
        component={ h(proposals(PreVoteProposals), { onLoadMoreProposals, noMoreProposals: noMoreProposals.preVote }) }
        link={<ListLink count={preVoteCount}><T id="proposals.statusLinks.preVote" m="In Discussion" /></ListLink> }
      />
      <Tab path="/governance/proposals/activevote"
        component={ h(proposals(ActiveVoteProposals), { onLoadMoreProposals, noMoreProposals: noMoreProposals.activeVote }) }
        link={<ListLink count={activeVoteCount}><T id="proposals.statusLinks.underVote" m="Voting" /></ListLink>}
      />
      <Tab path="/governance/proposals/voted"
        component={ h(proposals(FinishedProposal), { onLoadMoreProposals, noMoreProposals: noMoreProposals.finishedVote, finishedVote: true }) }
        link={<T id="proposals.statusLinks.voted" m="Finished Voting" />} />
      <Tab path="/governance/proposals/abandoned"
        component={ h(proposals(AbandonedProposals), { onLoadMoreProposals, noMoreProposals: noMoreProposals.abandonedVote }) }
        link={<T id="proposals.statusLinks.abandoned" m="Abandoned" />} />
    </TabbedPage>
  );
}

export default ProposalsList;
