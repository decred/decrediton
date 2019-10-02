import { FormattedMessage as T } from "react-intl";
import { activeVoteProposals, preVoteProposals, finishedProposals, abandonedProposals } from "connectors";
import { VotingProgress } from "indicators";
import { PoliteiaLoading, NoProposals } from "indicators";
import { VOTESTATUS_ACTIVEVOTE, VOTESTATUS_FINISHEDVOTE } from "actions/GovernanceActions";
import InfiniteScroll from "react-infinite-scroller";
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
  votingSinceLastAccess, quorumMinimumVotes }) => {

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
        {voteStatus !== VOTESTATUS_FINISHEDVOTE &&
        <div className="proposal-timestamp">
          <T id="proposalItem.lastUpdatedAt" m="Last Updated {reldate}" values={{
            reldate: <FormattedRelative  value={ tsDate(timestamp) } /> }} />
        </div>}
      </div>
      {( voteStatus === VOTESTATUS_ACTIVEVOTE || voteStatus === VOTESTATUS_FINISHEDVOTE) &&
        <>
          <VoteChoice currentVoteChoice={currentVoteChoice} />
          <VotingProgress {...{ voteCounts, quorumMinimumVotes } }  />
        </>}
      { voteStatus === VOTESTATUS_FINISHEDVOTE &&
        <VoteResults  {...{ currentVoteChoice, quorumPass, voteResult }}/>}
    </div>
  );
};

const ProposalList = ({
  proposals, loading, viewProposalDetails, tsDate, finishedProposal, noMoreProposals, onLoadMoreProposals
}) => {
  return (
    <>
      { loading
        ? <div className="proposal-loading-page"><PoliteiaLoading center /></div>
        : proposals && proposals.length
          ? (
            <InfiniteScroll
              hasMore={!noMoreProposals}
              loadMore={onLoadMoreProposals}
              initialLoad={false}
              useWindow={false}
              threshold={0}
            >
              <div className={finishedProposal ? "proposal-list ended" : "proposal-list"}>
                {proposals.map(v => (
                  <ProposalListItem key={v.token} {...v} tsDate={tsDate} onClick={viewProposalDetails} />
                ))}
              </div>
            </InfiniteScroll>
          )
          : <NoProposals />
      }
    </>
  );};

export const ActiveVoteProposals = activeVoteProposals(ProposalList);
export const PreVoteProposals = preVoteProposals(ProposalList);
export const FinishedProposal = finishedProposals(ProposalList);
export const AbandonedProposals = abandonedProposals(ProposalList);
