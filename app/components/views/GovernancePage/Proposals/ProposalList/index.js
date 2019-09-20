import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import { PreVoteProposals, ActiveVoteProposals, FinishedProposal } from "./Page";
import { shell } from "electron";
import { TabbedPage, TabbedPageTab as Tab } from "layout";
import { newProposalCounts, proposals } from "connectors";

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
  }

  componentDidMount() {
    if (!this.props.inventory) {
      return;
    }
    const preProposalsBatch = this.props.inventory.preVote;
    this.props.getProposalsAndUpdateVoteStatus(preProposalsBatch);
  }

  componentDidUpdate(prevProps) {
    const { inventory, proposalsList, location, proposallistpagesize } = this.props;
    if (prevProps.location === location) {
      return;
    }
    const tab = this.getProposalsTab();
    const proposalsLength = proposalsList[tab].length;
    if (proposalsLength >= inventory[tab].length) {
      return;
    }
    const proposalBatch = inventory[tab].slice(proposalsLength + 1, proposallistpagesize);
    console.log(inventory[tab])
    console.log(proposalBatch)
    this.props.getProposalsAndUpdateVoteStatus(proposalBatch, proposalsLength);
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
  }

  render() {
    const { newActiveVoteProposalsCount, newPreVoteProposalsCount } = this.props;

    return (
      <TabbedPage caret={<div/>} header={<PageHeader />} >
        <Tab path="/governance/proposals/prevote" component={proposals(PreVoteProposals)}
          link={<ListLink count={newPreVoteProposalsCount}><T id="proposals.statusLinks.preVote" m="Under Discussion" /></ListLink>} />
        <Tab path="/governance/proposals/activevote" component={proposals(ActiveVoteProposals)}
          link={<ListLink count={newActiveVoteProposalsCount}><T id="proposals.statusLinks.underVote" m="Under Vote" /></ListLink>}/>
        <Tab path="/governance/proposals/voted" component={proposals(FinishedProposal)}
          link={<T id="proposals.statusLinks.voted" m="Finished Voting" />}/>
      </TabbedPage>
    );
  }
}

export default proposals(newProposalCounts(ProposalsList));
