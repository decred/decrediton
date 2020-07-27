import { FormattedMessage as T } from "react-intl";
import { VotingProgress } from "indicators";
import {
  VOTESTATUS_ACTIVEVOTE,
  VOTESTATUS_FINISHEDVOTE
} from "actions/GovernanceActions";
import { FormattedRelative } from "shared";
import { classNames } from "pi-ui";
import { useProposalsListItem } from "../hooks";
import styles from "./ProposalsListItem.module.css";

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
  quorumMinimumVotes,
  finishedVote
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
        styles.listiTtem,
        styles[voteResult],
        finishedVote && styles.ended,
        isModified && styles.modified
      )}>
      <div>
        <div className={styles.name}>{name}</div>
        <div className={styles.token}>{token.substring(0, 7)}</div>
      </div>
      <div className={styles.resultsArea}>
        {(voteStatus === VOTESTATUS_ACTIVEVOTE ||
          voteStatus === VOTESTATUS_FINISHEDVOTE) && (
          <div className={classNames("is-row", styles.votingIndicator)}>
            <div
              className={classNames(
                styles.voteChoice,
                currentVoteChoice && styles[currentVoteChoice.id]
              )}
            />
            <VotingProgress {...{ voteCounts, quorumMinimumVotes }} />
          </div>
        )}
        {voteStatus !== VOTESTATUS_FINISHEDVOTE ? (
          <div className={styles.timestamp}>
            <T
              id="proposalItem.lastUpdatedAt"
              m="Last Updated {reldate}"
              values={{
                reldate: <FormattedRelative value={tsDate(timestamp)} />
              }}
            />
          </div>
        ) : (
          <div className={styles.voteResult}>
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
