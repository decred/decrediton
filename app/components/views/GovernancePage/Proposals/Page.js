import { cloneElement as k, createElement as h } from "react";
import { FormattedMessage as T } from "react-intl";
import { PoliteiaLink as PiLink } from "shared";
import ProposalList from "./ProposalList";
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
    const {loading, viewProposalDetails, tsDate, finishedProposal } = props
    this.state = {
      component: h(ProposalList, { proposals: this.getProposalsTab(), loading, viewProposalDetails, tsDate, finishedProposal }),
    }
  }

  componentDidMount() {
    const { loading, viewProposalDetails, tsDate, finishedProposal } = this.props;
    const preProposalsBatch = this.props.inventory && this.props.inventory.pre;
    this.setState({
      component: h(ProposalList, { proposals: this.getProposalsTab(), loading, viewProposalDetails, tsDate, finishedProposal }),
    }),
    this.props.getProposalsAndUpdateVoteStatus(preProposalsBatch)
  }

  componentDidUpdate(prevProps, prevState) {
    const { proposals, loading, viewProposalDetails, tsDate, finishedProposal, } = this.props;
    if (proposals !== prevProps.proposals || loading != prevProps.loading ) {
      this.setState({ component: h(ProposalList, { proposals: this.getProposalsTab(), loading, viewProposalDetails, tsDate, finishedProposal, }) });
    }
  }

  getProposalsTab() {
    const { proposals, location } = this.props;
    const { pathname } = location;
    if (pathname.includes("prevote")) {
      return proposals.preVote;
    }
    if (pathname.includes("activevote")) {
      return proposals.activeVote;
    }
    if (pathname.includes("voted")) {
      return proposals.finishedVote
    }
  }

  render() {
    const { newActiveVoteProposalsCount, newPreVoteProposalsCount } = this.props;
    const { component } = this.state;

    return (
      <TabbedPage caret={<div/>} header={<PageHeader />} >
        <Tab path="/governance/proposals/prevote" component={component}
          link={<ListLink count={newPreVoteProposalsCount}><T id="proposals.statusLinks.preVote" m="Under Discussion" /></ListLink>} />
        <Tab path="/governance/proposals/activevote" component={component}
          link={<ListLink count={newActiveVoteProposalsCount}><T id="proposals.statusLinks.underVote" m="Under Vote" /></ListLink>}/>
        <Tab path="/governance/proposals/voted" component={component}
          link={<T id="proposals.statusLinks.voted" m="Finished Voting" />}/>
      </TabbedPage>
    );
  }
}

export default proposals(newProposalCounts(ProposalsPage));
