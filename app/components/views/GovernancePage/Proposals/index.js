import { ProposalList } from "./Page";
import PoliteiaDisabled from "./PoliteiaDisabled";
import { useSelector, useDispatch } from 'react-redux';
import { setLastPoliteiaAccessTime } from "actions/WalletLoaderActions";
import * as sel from "selectors";

import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import { TabbedPage, TabbedPageTab as Tab } from "layout";
import { proposals } from "connectors";
import { createElement as h, useState, useEffect } from "react";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
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

function Proposals() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLastPoliteiaAccessTime())
  }, []);
  const {
    inventory, proposalsList, location, activeVoteCount, preVoteCount, preVoteProposals,
    politeiaEnabled, activeVoteProposals, finishedProposals, abandonedProposals
} = useSelector(state => ({
    politeiaEnabled: sel.politeiaEnabled(state),
    inventory: sel.inventory(state),
    proposalsList: sel.proposals(state),
    location: sel.location(state),
    activeVoteCount: sel.newActiveVoteProposalsCount(state),
    preVoteCount: sel.newPreVoteProposalsCount(state),
    preVoteProposals: sel.preVoteProposals(state),
    activeVoteProposals: sel.activeVoteProposals(state),
    finishedProposals: sel.finishedProposals(state),
    abandonedProposals: sel.abandonedProposals(state)
  }));

  if (!politeiaEnabled) {
    return <PoliteiaDisabled />;
  }

  const [ tab, setTab] = useState(getProposalsTab(location));
  const [ state, send ] = useMachine(fetchMachine, {
    actions: {
      initial: () => {
        if (proposalsList[tab] && proposalsList[tab].length > 0) {
          send({ type: "RESOLVE", data: proposals })
        }
      },
      onSucess: () => {
        // console.log("aqui no success")
      },
      load: () => {
        onLoadMoreProposals().then(res => {
          send({ type: 'RESOLVE', data: res });
        })
      }
    }
  });
  const [ noMoreProposals, setNoMoreProposals ] = useState({
    noMoreProposals: {
      activeVote: false,
      finishedVote: false,
      preVote: false,
      abandonedVote: false
    }
  });
  useEffect(() => {
    setTab(getProposalsTab(location))
  }, [location]);

  // TODO: Get proposallistpagesize from politeia's request: /v1/policy
  async function onLoadMoreProposals(proposallistpagesize = 20) {
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
    try {
      send('FETCH');
      await dispatch(getProposalsAndUpdateVoteStatus(proposalBatch));
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <TabbedPage onChange={onLoadMoreProposals} caret={<div/>} header={<PageHeader />} >
      <Tab path="/governance/proposals/prevote"
        // component={ () => h(ProposalList, { tsDate, viewProposalDetails: viewProposalDetailsFn, onLoadMoreProposals, noMoreProposals: noMoreProposals.preVote, state, proposals: preVoteProposals }) }
        component={() => <ProposalList { ...{ send, onLoadMoreProposals, noMoreProposals: noMoreProposals.preVote, state, proposals: preVoteProposals }} /> }
        link={<ListLink count={preVoteCount}><T id="proposals.statusLinks.preVote" m="In Discussion" /></ListLink> }
      />
      <Tab path="/governance/proposals/activevote"
        component={() => h(ProposalList, { onLoadMoreProposals, noMoreProposals: noMoreProposals.activeVote, state, proposals: activeVoteProposals }) }
        link={<ListLink count={activeVoteCount}><T id="proposals.statusLinks.underVote" m="Voting" /></ListLink>}
      />
      <Tab path="/governance/proposals/voted"
        component={() => h(ProposalList, { onLoadMoreProposals, noMoreProposals: noMoreProposals.finishedVote, finishedVote: true, state, proposals: finishedProposals }) }
        link={<T id="proposals.statusLinks.voted" m="Finished Voting" />} />
      <Tab path="/governance/proposals/abandoned"
        component={() => h(ProposalList, { onLoadMoreProposals, noMoreProposals: noMoreProposals.abandonedVote, state, proposals: abandonedProposals }) }
        link={<T id="proposals.statusLinks.abandoned" m="Abandoned" />} />
    </TabbedPage>
  )
}

export default Proposals;
