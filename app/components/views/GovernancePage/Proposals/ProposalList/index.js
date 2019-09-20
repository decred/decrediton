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
    console.log("aqui")
    console.log(this.props)
    if (!this.props.inventory) {
      return;
    }
    const preProposalsBatch = this.props.inventory.pre;
    this.props.getProposalsAndUpdateVoteStatus(preProposalsBatch);
  }

  componentDidUpdate(prevProps) {

    const { inventory, location } = this.props;
    if (prevProps.location === location) {
      return;
    }
    const proposalBatch = this.getProposalsTab().reduce( (accumulator, p) =>
      accumulator.concat(inventory[p]), [] );
    this.props.getProposalsAndUpdateVoteStatus(proposalBatch);
  }

  getProposalsTab() {
    const { location } = this.props;
    const { pathname } = location;
    if (pathname.includes("prevote")) {
      return [ "pre" ];
    }
    if (pathname.includes("activevote")) {
      return [ "active" ];
    }
    if (pathname.includes("voted")) {
      return [ "approved", "rejected" ];
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
