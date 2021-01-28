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
  finishedVote,
  linkto,
  linkedfrom,
  approved
}) => {
  const { viewProposalDetailsHandler, tsDate } = useProposalsListItem(token);
  const isVoting = voteStatus === VOTESTATUS_ACTIVEVOTE;
  const isVotingFinished = voteStatus === VOTESTATUS_FINISHEDVOTE;
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
        !approved && styles.declined,
        finishedVote && styles.ended,
        isModified && styles.modified
      )}>
      <div>
        <div className={styles.title}>
          <div className={styles.name}>{name}</div>
          {linkedfrom && (
            <div className={styles.rfp}>
              <T id="proposalItem.rfp" m="RFP" />
            </div>
          )}
          {linkto && (
            <div className={styles.rfp}>
              <T id="proposalItem.proposedForRfp" m="Proposed for RFP" />
            </div>
          )}
        </div>
        <div className={styles.token}>{token.substring(0, 7)}</div>
      </div>
      <div className={styles.resultsArea}>
        {(isVoting || isVotingFinished) && (
          <div className={classNames("is-row", styles.votingIndicator)}>
            <div
              className={classNames(
                styles.voteChoice,
                isVotingFinished && quorumPass && styles[voteResult],
                isVoting && currentVoteChoice && styles[currentVoteChoice.id]
              )}
            />
            <VotingProgress {...{ voteCounts, quorumMinimumVotes }} />
          </div>
        )}
        {voteStatus !== VOTESTATUS_FINISHEDVOTE ? (
          <div className={styles.timestamp}>
            <T
              id="proposalItem.lastUpdatedAt"
              m="Last updated {reldate}"
              values={{
                reldate: <FormattedRelative value={tsDate(timestamp)} />
              }}
            />
          </div>
        ) : (
          <div className={styles.voteResult}>
            {quorumPass ? (
              linkto && !approved && voteResult !== "declined" ? (
                <T id="proposals.rfpRejected" m="Proposal not chosen" />
              ) : (
                voteResult
              )
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
