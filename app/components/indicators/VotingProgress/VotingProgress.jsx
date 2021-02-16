import { classNames } from "pi-ui";
import styles from "./VotingProgress.module.css";

export default ({ voteCounts, quorumMinimumVotes, className }) => {
  if (!voteCounts) return <></>;

  // TODO: support options other than yes/no/abstain (currently not used on
  // politeia)

  const yesCount = voteCounts.yes;
  const noCount = voteCounts.no;
  // const abstainCount = voteCounts.abstain;

  let yesPerc = 0;
  let noPerc = 0;

  yesPerc = (yesCount / quorumMinimumVotes) * 100;
  noPerc = (noCount / quorumMinimumVotes) * 100;
  // const abstainPerc = (abstainCount / quorumMinimumVotes) * 100;

  return (
    <div
      className={classNames(styles.votingProgressIndicator, className)}
      data-testid="voting-progress">
      <div
        className={styles.votingProgressYes}
        style={{ width: yesPerc + "%" }}
      />
      <div
        className={styles.votingProgressNo}
        style={{ width: noPerc + "%" }}
      />
      {/* <div className="voting-progress-abstain" style={{ width: abstainPerc + "%" }} /> */}
    </div>
  );
};
