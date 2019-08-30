import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import { ActiveVoteProposals, PreVoteProposals, VotedProposals, AbandonedProposals } from "./ProposalList";
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
class ProposalsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      proposalTab: this.getTab(),
    }
  }

  componentDidMount() {
    const preProposalsBatch = this.props.inventory && this.props.inventory.pre;
    this.props.getProposalsBatch(preProposalsBatch)
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props)
    const { pathname } = this.props.location;
    const { proposalTab } = this.state;
    if (proposalTab === prevState.proposalTab) {
      return;
    }
    if (pathname !== prevProps.location.pathname) {
      this.setState({ proposalTab: this.getTab() });
    }
  }

  getTab() {
    const { pathname } = this.props.location;
    if (pathname.includes("prevote")) {
      return "prevote";
    }
    if (pathname.includes("activevote")) {
      return "activevote";
    }
    if (pathname.includes("voted")) {
      return "voted";
    }
    if (ppathname.includes("abandoned")) {
      return "abandoned";
    }
  }

  render() {
    const { newActiveVoteProposalsCount, newPreVoteProposalsCount } = this.props;
    return (
      <TabbedPage caret={<div/>} header={<PageHeader />} >
        <Tab path="/governance/proposals/prevote" component={PreVoteProposals}
          link={<ListLink count={newPreVoteProposalsCount}><T id="proposals.statusLinks.preVote" m="Under Discussion" /></ListLink>}/>
        <Tab path="/governance/proposals/activevote" component={ActiveVoteProposals}
          link={<ListLink count={newActiveVoteProposalsCount}><T id="proposals.statusLinks.underVote" m="Under Vote" /></ListLink>}/>
        <Tab path="/governance/proposals/voted" component={VotedProposals}
          link={<T id="proposals.statusLinks.voted" m="Finished Voting" />}/>
        <Tab path="/governance/proposals/abandoned" component={AbandonedProposals}
          link={<T id="proposals.statusLinks.abandoned" m="Abandoned" />}/>
      </TabbedPage>
    );
  }
}

export default proposals(newProposalCounts(ProposalsPage));
