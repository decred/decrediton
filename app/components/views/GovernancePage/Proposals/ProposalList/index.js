import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import { PreVoteProposals, ActiveVoteProposals, FinishedProposal, AbandonedProposals } from "./Page";
import { TabbedPage, TabbedPageTab as Tab } from "layout";
import { newProposalCounts, proposals } from "connectors";
import { createElement as h } from "react";

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

@autobind
class ProposalsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noMoreProposals: {
        activeVote: false,
        finishedVote: false,
        preVote: false,
        abandonedVote: false
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { location } = this.props;
    const { noMoreProposals } = this.state;
    const tab = this.getProposalsTab();

    if (prevProps.location === location) {
      return;
    }
    if (noMoreProposals[tab] === prevState[tab]) {
      return;
    }
    this.onLoadMoreProposals();
  }

  getProposalsTab() {
    const { location } = this.props;
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

  onLoadMoreProposals() {
    const { inventory, proposalsList, proposallistpagesize } = this.props;
    const tab = this.getProposalsTab();
    if (!proposalsList[tab] || !inventory[tab]) {
      return;
    }

    const proposalLength = proposalsList[tab].length;
    if (proposalLength === inventory[tab].length) {
      this.setState({
        noMoreProposals: { ...this.state.noMoreProposals, [tab]: true }
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
    this.props.getProposalsAndUpdateVoteStatus(proposalBatch);
  }

  render() {
    const { newActiveVoteProposalsCount, newPreVoteProposalsCount } = this.props;
    const { noMoreProposals } = this.state;
    const { onLoadMoreProposals } = this;

    return (
      <TabbedPage caret={<div/>} header={<PageHeader />} >
        <Tab path="/governance/proposals/prevote"
          component={ h(proposals(PreVoteProposals), { onLoadMoreProposals, noMoreProposals: noMoreProposals.preVote }) }
          link={<ListLink count={newPreVoteProposalsCount}><T id="proposals.statusLinks.preVote" m="In Discussion" /></ListLink> }
        />
        <Tab path="/governance/proposals/activevote"
          component={ h(proposals(ActiveVoteProposals), { onLoadMoreProposals, noMoreProposals: noMoreProposals.activeVote }) }
          link={<ListLink count={newActiveVoteProposalsCount}><T id="proposals.statusLinks.underVote" m="Voting" /></ListLink>}
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
}

export default proposals(newProposalCounts(ProposalsList));
