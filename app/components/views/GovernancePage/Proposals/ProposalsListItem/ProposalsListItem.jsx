import { FormattedMessage as T } from "react-intl";
import { VotingProgress } from "indicators";
import {
  VOTESTATUS_ACTIVEVOTE,
  VOTESTATUS_FINISHEDVOTE
} from "actions/GovernanceActions";
import { FormattedRelative } from "shared";
import { classNames } from "pi-ui";
import { useProposalsListItem } from "../hooks";
const ProposalsListItem = ({
  name,
  timestamp,
  token,
  voteCounts,
  voteStatus,
  currentVoteChoice,
  quorumPass,
  voteResult,
  modifiedSinceLastAccess,
  votingSinceLastAccess,
  quorumMinimumVotes
}) => {
  const { viewProposalDetailsHandler, tsDate } = useProposalsListItem(token);
  const isVoting = voteStatus == VOTESTATUS_ACTIVEVOTE;
  const isModified =
    (!isVoting && modifiedSinceLastAccess) ||
    (isVoting && votingSinceLastAccess);
  return (
    <div
      onClick={viewProposalDetailsHandler}
      className={classNames(
        "is-row",
        "proposal-list-item",
        voteResult,
        isModified && "proposal-modified-since-last-access"
      )}>
      <div className="info">
        <div className="proposal-name">{name}</div>
        <div className="proposal-token">{token}</div>
      </div>
      <div className="proposal-results-area">
        {(voteStatus === VOTESTATUS_ACTIVEVOTE ||
          voteStatus === VOTESTATUS_FINISHEDVOTE) && (
          <div className="is-row voting-indicator">
            <div
              className={
                "vote-choice " + (currentVoteChoice && currentVoteChoice.id)
              }
            />
            <VotingProgress {...{ voteCounts, quorumMinimumVotes }} />
          </div>
        )}
        {voteStatus !== VOTESTATUS_FINISHEDVOTE ? (
          <div className="proposal-timestamp">
            <T
              id="proposalItem.lastUpdatedAt"
              m="Last Updated {reldate}"
              values={{
                reldate: <FormattedRelative value={tsDate(timestamp)} />
              }}
            />
          </div>
        ) : (
          <div className="vote-result">
            {quorumPass ? (
              voteResult
            ) : (
              <T id="proposals.quorumNotMet" m="Quorum not met" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalsListItem;
