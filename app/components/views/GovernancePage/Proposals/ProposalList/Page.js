import { FormattedMessage as T } from "react-intl";
import { activeVoteProposals, preVoteProposals, finishedProposals, abandonedProposals } from "connectors";
import { VotingProgress } from "indicators";
import { PoliteiaLoading, NoProposals } from "indicators";
import { VOTESTATUS_ACTIVEVOTE, VOTESTATUS_FINISHEDVOTE } from "actions/GovernanceActions";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedRelative } from "shared";

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
          <div className={"proposal-vote-choice " + (currentVoteChoice && currentVoteChoice.id)}/>
          <VotingProgress {...{ voteCounts, quorumMinimumVotes } }  />
        </>}
      { voteStatus === VOTESTATUS_FINISHEDVOTE && (
        <div className="proposal-vote-result">
          <div className="proposal-vote-passage">{quorumPass ? voteResult : <T id="proposals.quorumNotMet" m="Quorum not met"/>}</div>
        </div>
      )}
    </div>
  );
};

const ProposalList = ({
  proposals, loading, viewProposalDetails, tsDate, finishedProposal, noMoreProposals, onLoadMoreProposals
}) => (
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
);

export const ActiveVoteProposals = activeVoteProposals(ProposalList);
export const PreVoteProposals = preVoteProposals(ProposalList);
export const FinishedProposal = finishedProposals(ProposalList);
export const AbandonedProposals = abandonedProposals(ProposalList);
