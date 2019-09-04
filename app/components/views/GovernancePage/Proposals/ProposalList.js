import { FormattedMessage as T } from "react-intl";
import { activeVoteProposals, preVoteProposals, votedProposals, proposals, abandonedProposals } from "connectors";
import { VotingProgress } from "indicators";
import { PoliteiaLoading, NoProposals } from "indicators";
import { VOTESTATUS_ACTIVEVOTE, VOTESTATUS_VOTED } from "actions/GovernanceActions";
import { FormattedRelative } from "shared";

const VoteChoiceText = ({ currentVoteChoice }) => {
  if (!currentVoteChoice) {
    return <div>&nbsp;</div>;
  }

  let voteChoiceString =
    (currentVoteChoice !== "abstain")
      ? (<><T id="proposal.voted" m="Voted"/> {currentVoteChoice}</>)
      : <T id="proposal.noVote" m="No vote cast"/>;

  return <>
    <div className={"proposal-vote-choice " + currentVoteChoice}/>
    <div className="proposal-vote-choice-text">{voteChoiceString}</div>
  </>;
};

const VoteChoice = ({ currentVoteChoice }) =>
  <div className={"proposal-vote-choice " + currentVoteChoice}/>;
const VoteResults = ({ currentVoteChoice, quorumPass, voteResult }) => (
  <div className="proposal-vote-result">
    <div className="proposal-vote-choice-area">
      <VoteChoiceText currentVoteChoice={currentVoteChoice}/>
    </div>
    <div className="proposal-vote-passage">{quorumPass ? voteResult : <T id="proposals.quorumNotMet" m="Quorum not met"/>}</div>
  </div>
);

const ProposalListItem = ({ name, timestamp, token, voteCounts, tsDate, onClick,
  voteStatus, currentVoteChoice, quorumPass, voteResult, modifiedSinceLastAccess,
  votingSinceLastAccess }) => {

  const isVoting = voteStatus == VOTESTATUS_ACTIVEVOTE;
  const modifiedClassName =
    (!isVoting && modifiedSinceLastAccess) || (isVoting && votingSinceLastAccess)
      ? "proposal-modified-since-last-access"
      : null;
  const className = [ "proposal-list-item", voteResult, modifiedClassName ].join(" ");

  return (
    <div className={className} onClick={() => onClick(token)}>
      <div className="info">
        <div className="proposal-name">{ name }</div>
        <div className="proposal-token">{ token }</div>
        {voteStatus !== VOTESTATUS_VOTED &&
        <div className="proposal-timestamp">
          <T id="proposalItem.lastUpdatedAt" m="Last Updated {reldate}" values={{
            reldate: <FormattedRelative  value={ tsDate(timestamp) } /> }} />
        </div>}
      </div>
      {voteStatus == VOTESTATUS_ACTIVEVOTE &&
        <>
          <VoteChoice currentVoteChoice={currentVoteChoice} />
          <VotingProgress voteCounts={voteCounts} />
        </>}
      {voteStatus == VOTESTATUS_VOTED &&
        <VoteResults  {...{ currentVoteChoice, quorumPass, voteResult }}/>}
    </div>
  );
};

@autobind
class ProposalList extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    const {
      proposals, loading, viewProposalDetails, tsDate, finishedProposal,
    } = this.props;
    return (
    <>
      { loading
        ? <div className="proposal-loading-page"><PoliteiaLoading center /></div>
        : proposals && proposals.length
          ? (
            <div className={finishedProposal ? "proposal-list ended" : "proposal-list"}>
              {proposals.map(v => (
                <ProposalListItem key={v.token} {...v} tsDate={tsDate} onClick={viewProposalDetails} />
              ))}
            </div>
          )
          : <NoProposals />
      }
    </>);
  }
}

export default (ProposalList);
