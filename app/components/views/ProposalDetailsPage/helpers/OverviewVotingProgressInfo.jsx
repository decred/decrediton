import { VotingProgress } from "indicators";
import styles from "../ProposalDetails.module.css";

const OverviewVotingProgressInfo = React.memo(
  ({ voteCounts, quorumMinimumVotes }) => {
    return (
      <div className={styles.votingProgressWrapper}>
        <div className={styles.votingProgress}>
          <div className={styles.progressCounts}>
            <div className={styles.yesCountBox} />
            {voteCounts.yes}
            <div className={styles.noCountBox} />
            {voteCounts.no}
            {/* TODO: return if we have have quorum/total ticket counts available.
          <div className={styles.abstainCountBox /><T id="proposal.progressCount.abstain" m="{count} Abstain" values={{ count: voteCounts.abstain }} /> */}
          </div>
          <VotingProgress
            className={styles.progressIndicator}
            {...{ voteCounts, quorumMinimumVotes }}
          />
        </div>
      </div>
    );
  }
);

export default OverviewVotingProgressInfo;
