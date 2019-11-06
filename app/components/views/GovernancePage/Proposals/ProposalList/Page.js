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

  return (
    <div onClick={() => onClick(token)}
      className={[ "is-row", "proposal-list-item", voteResult, modifiedClassName ].join(" ")}
    >
      <div className="info">
        <div className="proposal-name">{ name }</div>
        <div className="proposal-token">{ token }</div>
      </div>
      <div className="proposal-results-area">
        {( voteStatus === VOTESTATUS_ACTIVEVOTE || voteStatus === VOTESTATUS_FINISHEDVOTE) &&
          <div className="is-row voting-indicator">
            <div className={"vote-choice " + (currentVoteChoice && currentVoteChoice.id)}/>
            <VotingProgress {...{ voteCounts, quorumMinimumVotes } }  />
          </div>
        }
        { voteStatus !== VOTESTATUS_FINISHEDVOTE ?
          <div className="proposal-timestamp">
            <T id="proposalItem.lastUpdatedAt" m="Last Updated {reldate}" values={{
              reldate: <FormattedRelative  value={ tsDate(timestamp) } /> }} />
          </div> :
          <div className="vote-result">
            {quorumPass ? voteResult : <T id="proposals.quorumNotMet" m="Quorum not met"/>}
          </div>
        }
      </div>
    </div>
  );
};

const ProposalList = ({
  proposals, loading, viewProposalDetails, tsDate, finishedVote, noMoreProposals, onLoadMoreProposals
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
            <div className={"proposal-list " + (finishedVote && "ended")}>
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
